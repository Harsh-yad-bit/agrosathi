import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, getIsConnected } from '@/lib/db';
import { Farmer } from '@/models/Farmer';
import { Farm } from '@/models/Farm';
import { Scan } from '@/models/Scan';
import { Alert } from '@/models/Alert';

export async function GET() {
  try {
    const connected = await connectDB();
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1;

    let collections = {
      farmers: 0,
      farms: 0,
      scans: 0,
      alerts: 0,
    };

    if (isConnected) {
      try {
        collections = {
          farmers: await Farmer.countDocuments(),
          farms: await Farm.countDocuments(),
          scans: await Scan.countDocuments(),
          alerts: await Alert.countDocuments(),
        };
      } catch (e) {
        // collection count optional
      }
    }

    return NextResponse.json({
      status: 'ok',
      database: isConnected ? 'connected' : 'demo-in-memory',
      databaseHost: '127.0.0.1:27017',
      databaseName: 'sih131',
      zeroApiKeyMode: true,
      authProvider: 'local-credentials',
      collections,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'fallback',
      database: 'demo-in-memory',
      zeroApiKeyMode: true,
      error: error.message || 'Local MongoDB connection error',
    }, { status: 200 });
  }
}
