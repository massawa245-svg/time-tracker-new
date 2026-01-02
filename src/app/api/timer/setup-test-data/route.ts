import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import TimeEntry from '../../models/TimeEntry';

export async function GET() {
  try {
    await connectDB();

    // Lösche vorhandene Test-Daten
    await TimeEntry.deleteMany({ userId: { $in: ['1', '2'] } });

    // Erstelle Test-Zeiteinträge für Demo-User
    const testEntries = [
      {
        userId: '1',
        startTime: new Date('2024-11-15T07:00:00'),
        endTime: new Date('2024-11-15T12:00:00'),
        duration: 5 * 3600, // 5 Stunden in Sekunden
        date: '2024-11-15',
        status: 'stopped',
      },
      {
        userId: '1',
        startTime: new Date('2024-11-15T13:00:00'),
        endTime: new Date('2024-11-15T17:00:00'),
        duration: 4 * 3600, // 4 Stunden in Sekunden
        date: '2024-11-15',
        status: 'stopped',
      },
      {
        userId: '2',
        startTime: new Date('2024-11-15T08:00:00'),
        endTime: new Date('2024-11-15T16:30:00'),
        duration: 8.5 * 3600, // 8.5 Stunden in Sekunden
        date: '2024-11-15',
        status: 'stopped',
      }
    ];

    await TimeEntry.insertMany(testEntries);

    return NextResponse.json({
      success: true,
      message: 'Test timer entries created successfully',
      entries: testEntries
    });

  } catch (error) {
    console.error('Create test timer entries error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
