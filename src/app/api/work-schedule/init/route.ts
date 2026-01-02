import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import WorkSchedule from '@models/WorkSchedule';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Erstelle Test-Daten für die nächsten 7 Tage
    const today = new Date();
    const schedules = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Überspringe Wochenenden
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const schedule = await WorkSchedule.findOneAndUpdate(
        { 
          userId, 
          date: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999))
          }
        },
        {
          userId,
          date,
          plannedStart: '09:00',
          plannedEnd: '17:00',
          plannedHours: 8,
          status: 'planned'
        },
        { upsert: true, new: true }
      );

      schedules.push(schedule);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Work schedules initialized',
      schedules 
    });
  } catch (error) {
    console.error('Work schedule init error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}