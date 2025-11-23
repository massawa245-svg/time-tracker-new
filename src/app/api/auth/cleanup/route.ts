import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function DELETE() {
  try {
    await connectDB();

    // Lösche alle Test-User
    const result = await User.deleteMany({
      email: { 
        $in: [
          'test@example.com',
          'max.mustermann@example.com',
          'test.user@example.com'
        ]
      }
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} test users`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Cleanup failed',
      },
      { status: 500 }
    );
  }
}