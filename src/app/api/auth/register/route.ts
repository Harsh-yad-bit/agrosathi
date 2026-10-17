import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Farmer } from '@/models/Farmer';
import { Farm } from '@/models/Farm';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, state, district, village } = body;

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim()?.toLowerCase();
    const trimmedPhone = phone?.trim();

    if (!trimmedName || (!trimmedEmail && !trimmedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Name and either Email or Phone are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const query: any[] = [];
    if (trimmedEmail) query.push({ email: trimmedEmail });
    if (trimmedPhone) query.push({ phone: trimmedPhone });

    const existing = await Farmer.findOne({ $or: query });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Farmer already registered with this email or phone. Please log in.' },
        { status: 400 }
      );
    }

    const hashedPassword = password ? await bcrypt.hash(password.trim(), 10) : '';

    const newFarmer = new Farmer({
      name: trimmedName,
      email: trimmedEmail || (trimmedPhone ? `${trimmedPhone}@agrosarthi.local` : ''),
      phone: trimmedPhone || '',
      password: hashedPassword,
      location: {
        state: state?.trim() || 'Haryana',
        district: district?.trim() || 'Karnal',
        village: village?.trim() || 'Gharaunda',
      },
      language: 'en',
      theme: 'light',
    });

    await newFarmer.save();

    const newFarm = new Farm({
      farmerId: newFarmer._id,
      farmerName: newFarmer.name,
      location: {
        state: state?.trim() || 'Haryana',
        district: district?.trim() || 'Karnal',
        village: village?.trim() || 'Gharaunda',
        latitude: 29.5404,
        longitude: 76.9734,
      },
      crop: 'Wheat',
      cropVariety: 'HD-2967',
      farmArea: 2.5,
      farmAreaUnit: 'acres',
      growthStage: 'vegetative',
      irrigationMethod: 'canal',
      soilType: 'alluvial',
    });

    await newFarm.save();

    return NextResponse.json({
      success: true,
      message: 'Farmer account registered successfully',
      farmerId: newFarmer._id,
    });
  } catch (err: any) {
    console.error('[REGISTER ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
