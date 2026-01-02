import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import WorkSchedule from '@models/WorkSchedule';

export async function GET() {
  try {
    await connectDB();
    
    // Prüfe ob bereits ein Wochenplan existiert
    const existingPlan = await WorkSchedule.findOne({
      isWeeklyPlan: true,
      planPublished: true
    });

    if (existingPlan) {
      return NextResponse.json({ 
        success: true, 
        message: 'Weekly plan already exists',
        weeklyPlan: existingPlan 
      });
    }

    // Erstelle einen Test-Wochenplan
    const weeklyPlan = {
      monday: { start: "07:00", end: "16:00", pause: 45, hours: 8.25, enabled: true },
      tuesday: { start: "07:00", end: "16:00", pause: 45, hours: 8.25, enabled: true },
      wednesday: { start: "07:00", end: "16:00", pause: 45, hours: 8.25, enabled: true },
      thursday: { start: "07:00", end: "16:00", pause: 45, hours: 8.25, enabled: true },
      friday: { start: "07:00", end: "15:00", pause: 30, hours: 7.5, enabled: true },
      saturday: { start: "00:00", end: "00:00", pause: 0, hours: 0, enabled: false },
      sunday: { start: "00:00", end: "00:00", pause: 0, hours: 0, enabled: false }
    };

    const newWeeklyPlan = await WorkSchedule.create({
      userId: "demo-manager",
      date: new Date(),
      plannedStart: '07:00',
      plannedEnd: '16:00',
      plannedHours: 8.25,
      weeklyPlan: weeklyPlan,
      isWeeklyPlan: true,
      planPublished: true,
      publishedBy: "demo-manager",
      publishedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test weekly plan created successfully',
      weeklyPlan: newWeeklyPlan 
    });

  } catch (error) {
    console.error('Setup weekly plan error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
