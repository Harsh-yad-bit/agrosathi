import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { Farmer } from '@/models/Farmer';

export async function getUserFromRequest(req?: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session && session.user && (session.user as any).farmerId) {
      return {
        _id: (session.user as any).farmerId,
        name: session.user.name,
        email: session.user.email,
      };
    }

    // Local development fallback: if no session cookie, fetch primary local farmer from MongoDB
    await connectDB();
    const primaryFarmer = await Farmer.findOne();
    if (primaryFarmer) {
      return {
        _id: primaryFarmer._id.toString(),
        name: primaryFarmer.name,
        email: primaryFarmer.email,
      };
    }
  } catch (err) {
    console.error('[AUTH ERROR]', err);
  }
  
  return null;
}
