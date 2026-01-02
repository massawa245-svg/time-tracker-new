import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import TimeEntry from '@models/TimeEntry';

// Helper function to get userId from auth or request
function getUserId(request: Request): string | null {
  // Try to get from query params
  const { searchParams } = new URL(request.url);
  let userId = searchParams.get('userId');
  
  // If not in query, try from request body for POST
  if (!userId && request.method === 'POST') {
    // We'll parse body later
    return null;
  }
  
  // For demo/testing, use a fallback
  if (!userId || userId === 'undefined') {
    console.log(' No userId provided, using demo-user');
    return 'demo-user-' + Date.now(); // Unique demo user
  }
  
  return userId;
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, entryId } = body;
    
    // Get userId from body first, then from helper
    let userId = body.userId || getUserId(request);
    
    // If still no userId, check for other possible fields
    if (!userId && body.email) {
      userId = body.email; // Use email as fallback ID
    }
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID ist erforderlich',
          debug: {
            body: body,
            availableFields: Object.keys(body)
          }
        },
        { status: 400 }
      );
    }

    console.log(` Timer ${action} for user: ${userId}`);

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

      console.log(` Timer started: ${timeEntry._id} for ${userId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Timer erfolgreich gestartet',
        entry: timeEntry,
        userId: userId // Return for debugging
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
            debug: { entryId, userId }
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

      console.log(` Timer stopped: ${duration}s for ${userId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Timer erfolgreich gestoppt',
        entry: updatedTimer,
        duration: duration,
        userId: userId
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige Aktion',
          debug: { action, entryId, userId }
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error(' Timer error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Interner Server Fehler',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    let userId = getUserId(request);
    
    // For undefined userId, use demo
    if (!userId || userId === 'undefined') {
      userId = 'demo-user-' + Date.now();
    }

    console.log(` Getting timer data for: ${userId}`);

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

    console.log(` Timer data for ${userId}: running=${!!currentEntry}, today=${totalToday}s`);
    
    return NextResponse.json({
      success: true,
      currentEntry,
      todayEntries,
      totalToday,
      userId // Return userId for debugging
    });

  } catch (error) {
    console.error(' Timer get error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Interner Server Fehler',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
