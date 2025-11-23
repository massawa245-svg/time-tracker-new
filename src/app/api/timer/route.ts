import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TimeEntry from '@/models/TimeEntry';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId, action, entryId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID ist erforderlich',
        },
        { status: 400 }
      );
    }

    if (action === 'start') {
      // Stop any running timer for this user
      await TimeEntry.updateMany(
        {
          userId,
          status: 'running'
        },
        {
          status: 'stopped',
          endTime: new Date()
        }
      );

      // Start new timer
      const timeEntry = await TimeEntry.create({
        userId,
        startTime: new Date(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        status: 'running',
        duration: 0
      });

      return NextResponse.json({
        success: true,
        message: 'Timer erfolgreich gestartet',
        entry: timeEntry,
      });

    } else if (action === 'stop' && entryId) {
      // Find and stop running timer
      const runningTimer = await TimeEntry.findOne({
        _id: entryId,
        userId,
        status: 'running'
      });

      if (!runningTimer) {
        return NextResponse.json(
          {
            success: false,
            message: 'Kein laufender Timer gefunden',
          },
          { status: 404 }
        );
      }

      const endTime = new Date();
      const startTime = new Date(runningTimer.startTime);
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // in seconds

      // Update timer
      const updatedTimer = await TimeEntry.findByIdAndUpdate(
        entryId,
        {
          status: 'stopped',
          endTime,
          duration
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Timer erfolgreich gestoppt',
        entry: updatedTimer,
        duration: duration
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige Aktion',
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Timer error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Interner Server Fehler',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID ist erforderlich',
        },
        { status: 400 }
      );
    }

    // Get running timer
    const currentEntry = await TimeEntry.findOne({
      userId,
      status: 'running'
    });

    // Get today's total time
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = await TimeEntry.find({
      userId,
      date: today,
      status: 'stopped'
    });

    const totalToday = todayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);

    return NextResponse.json({
      success: true,
      currentEntry,
      todayEntries,
      totalToday
    });

  } catch (error) {
    console.error('Timer get error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Interner Server Fehler',
      },
      { status: 500 }
    );
  }
}
