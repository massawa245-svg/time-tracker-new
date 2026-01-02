import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import WorkSchedule from '@models/WorkSchedule';

export async function GET() {
  try {
    await connectDB();
    
    console.log(' Debug: Checking weekly plans...');
    
    // Alle Weekly Plans
    const allPlans = await WorkSchedule.find({ isWeeklyPlan: true });
    
    console.log(' Total weekly plans found:', allPlans.length);
    
    // Aktuell veröffentlichter Plan
    const publishedPlan = await WorkSchedule.findOne({ 
      isWeeklyPlan: true, 
      planPublished: true 
    });
    
    console.log(' Published plan found:', !!publishedPlan);
    
    const result = {
      success: true, 
      totalPlans: allPlans.length,
      publishedPlan: publishedPlan ? {
        _id: publishedPlan._id,
        hours: publishedPlan.weeklyPlan ? Object.values(publishedPlan.weeklyPlan).reduce((sum: number, day: any) => sum + (day.enabled ? day.hours : 0), 0) : 0,
        publishedAt: publishedPlan.publishedAt,
        publishedBy: publishedPlan.publishedBy
      } : null,
      allPlans: allPlans.map(p => ({
        _id: p._id,
        published: p.planPublished,
        hours: p.weeklyPlan ? Object.values(p.weeklyPlan).reduce((sum: number, day: any) => sum + (day.enabled ? day.hours : 0), 0) : 0,
        createdAt: p.createdAt,
        publishedAt: p.publishedAt,
        publishedBy: p.publishedBy
      }))
    };
    
    console.log('📋 Debug result:', result);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('❌ Weekly plan debug error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
