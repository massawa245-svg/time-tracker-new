import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Debug API works!',
    env: {
      hasMongoURI: !!process.env.MONGODB_URI,
      mongoURILength: process.env.MONGODB_URI?.length,
      hasNextAuthURL: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    },
    timestamp: new Date().toISOString()
  });
}