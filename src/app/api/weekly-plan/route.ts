import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import WorkSchedule from '@models/WorkSchedule';

// ✅ GET - Wochenplan abrufen (FÜR ALLE USER)
export async function GET() {
  try {
    await connectDB();
    
    console.log('🔍 GET Weekly Plan - Searching for published plan...');
    
    const weeklyPlan = await WorkSchedule.findOne({
      isWeeklyPlan: true,
      planPublished: true
    }).sort({ publishedAt: -1 });

    console.log('📊 Weekly Plan found:', !!weeklyPlan);

    if (!weeklyPlan) {
      return NextResponse.json({ 
        success: true, 
        weeklyPlan: null,
        message: 'Kein Wochenplan verfügbar' 
      });
    }

    return NextResponse.json({ 
      success: true, 
      weeklyPlan 
    });
  } catch (error) {
    console.error('❌ Weekly plan fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// ✅ POST - Wochenplan erstellen/veröffentlichen (EINFACHE VERSION)
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { weeklyPlan } = body;
    
    console.log('📨 POST Weekly Plan - Simple version');

    if (!weeklyPlan) {
      return NextResponse.json({ 
        error: 'Weekly plan data required' 
      }, { status: 400 });
    }

    // Deaktiviere vorherige Wochenpläne
    await WorkSchedule.updateMany(
      { isWeeklyPlan: true, planPublished: true },
      { planPublished: false }
    );

    // ✅ EINFACHE VERSION - Ohne userId Probleme
    const newWeeklyPlan = await WorkSchedule.create({
      userId: "65a1b2c3d4e5f67890123456", // Feste ID
      date: new Date(),
      plannedStart: '07:00',
      plannedEnd: '16:00', 
      plannedHours: 8.25,
      weeklyPlan: weeklyPlan,
      isWeeklyPlan: true,
      planPublished: true,
      publishedBy: "65a1b2c3d4e5f67890123456", // Feste ID
      publishedAt: new Date()
    });

    console.log('✅ New weekly plan created:', newWeeklyPlan._id);

    return NextResponse.json({ 
      success: true, 
      weeklyPlan: newWeeklyPlan,
      message: 'Wochenplan erfolgreich veröffentlicht' 
    });
  } catch (error: any) {
    console.error('❌ Weekly plan creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}