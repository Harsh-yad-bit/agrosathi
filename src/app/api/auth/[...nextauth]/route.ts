import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { Farmer } from '@/models/Farmer';
import { Farm } from '@/models/Farm';
import { demoFarmer } from '@/lib/demoData';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Farmer Credentials',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
        isDemo: { label: 'Is Demo', type: 'text' },
      },
      async authorize(credentials) {
        await connectDB();

        // 1. Quick demo login
        if (credentials?.isDemo === 'true' || credentials?.identifier === 'demo') {
          let farmer = await Farmer.findOne({ email: demoFarmer.email });
          if (!farmer) {
            farmer = await Farmer.findOne();
          }
          if (!farmer) {
            farmer = new Farmer(demoFarmer);
            await farmer.save();
          }
          return {
            id: farmer._id.toString(),
            name: farmer.name,
            email: farmer.email || 'farmer@agrosarthi.in',
            farmerId: farmer._id.toString(),
          };
        }

        const identifier = credentials?.identifier?.trim();
        const password = credentials?.password?.trim();

        if (!identifier) {
          throw new Error('Please enter your email or phone number');
        }

        // Search by email or phone
        let farmer = await Farmer.findOne({
          $or: [
            { email: { $regex: new RegExp(`^${identifier}$`, 'i') } },
            { phone: identifier },
          ],
        });

        if (!farmer) {
          // Auto-register first time local user seamlessly
          const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
          const isEmail = identifier.includes('@');
          farmer = new Farmer({
            name: isEmail ? identifier.split('@')[0] : `Farmer-${identifier.slice(-4)}`,
            email: isEmail ? identifier.toLowerCase() : `${identifier}@agrosarthi.local`,
            phone: !isEmail ? identifier : '',
            password: hashedPassword,
            location: { state: 'Haryana', district: 'Karnal', village: 'Gharaunda' },
            language: 'en',
            theme: 'light',
          });
          await farmer.save();

          // Also create initial farm profile
          const newFarm = new Farm({
            farmerId: farmer._id,
            farmerName: farmer.name,
            location: {
              state: 'Haryana',
              district: 'Karnal',
              village: 'Gharaunda',
              latitude: 29.5404,
              longitude: 76.9734,
            },
            crop: 'Wheat',
            cropVariety: 'HD-2967',
            farmArea: 3,
            farmAreaUnit: 'acres',
            growthStage: 'vegetative',
            irrigationMethod: 'canal',
            soilType: 'alluvial',
          });
          await newFarm.save();

          return {
            id: farmer._id.toString(),
            name: farmer.name,
            email: farmer.email,
            farmerId: farmer._id.toString(),
          };
        }

        // Verify password if set and provided
        if (farmer.password && password) {
          const isValid = await bcrypt.compare(password, farmer.password);
          if (!isValid && farmer.password !== password) {
            throw new Error('Incorrect password');
          }
        }

        return {
          id: farmer._id.toString(),
          name: farmer.name,
          email: farmer.email,
          farmerId: farmer._id.toString(),
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'agrosarthi-local-laptop-secret-key-2026',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.farmerId = (user as any).farmerId || user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.farmerId) {
        (session.user as any).farmerId = token.farmerId;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
