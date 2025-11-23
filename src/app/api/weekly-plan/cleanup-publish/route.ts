import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkSchedule from '@/models/WorkSchedule';

export async function GET() {
  try {
    await connectDB();
    
    console.log(' Cleanup: Removing old weekly plans...');
    
    // Lösche alle alten Weekly Plans
    const deleteResult = await WorkSchedule.deleteMany({ 
      isWeeklyPlan: true 
    });
    
    console.log(' Deleted old plans:', deleteResult.deletedCount);
    
    // Erstelle einen neuen aktuellen Wochenplan
    const weeklyPlan = {
      monday: { start: "08:00", end: "17:00", pause: 60, hours: 8, enabled: true },
      tuesday: { start: "08:00", end: "17:00", pause: 60, hours: 8, enabled: true },
      wednesday: { start: "08:00", end: "17:00", pause: 60, hours: 8, enabled: true },
      thursday: { start: "08:00", end: "17:00", pause: 60, hours: 8, enabled: true },
      friday: { start: "08:00", end: "17:00", pause: 60, hours: 8, enabled: true },
      saturday: { start: "00:00", end: "00:00", pause: 0, hours: 0, enabled: false },
      sunday: { start: "00:00", end: "00:00", pause: 0, hours: 0, enabled: false }
    };

    const newWeeklyPlan = await WorkSchedule.create({
      userId: "demo-manager",
      date: new Date(),
      plannedStart: '08:00',
      plannedEnd: '17:00',
      plannedHours: 8,
      weeklyPlan: weeklyPlan,
      isWeeklyPlan: true,
      planPublished: true,
      publishedBy: "Demo Manager",
      publishedAt: new Date()
    });

    console.log(' New plan created and published:', newWeeklyPlan._id);

    return NextResponse.json({ 
      success: true, 
      message: 'Cleanup and new plan creation successful',
      deletedCount: deleteResult.deletedCount,
      newPlan: {
        _id: newWeeklyPlan._id,
        hours: 40, // 5 Tage × 8 Stunden
        publishedAt: newWeeklyPlan.publishedAt,
        publishedBy: newWeeklyPlan.publishedBy
      }
    });

  } catch (error: any) {
    console.error('❌ Cleanup error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
