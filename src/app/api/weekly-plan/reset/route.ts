import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import WorkSchedule from '@models/WorkSchedule';
import { requireManager } from '@lib/api-auth';

export const POST = requireManager(async (request: NextRequest, user: any) => {
  try {
    await connectDB();
    
    console.log('🗑️ Weekly Plan Reset requested by:', user.name);
    
    // Lösche alle Weekly Plans
    const result = await WorkSchedule.deleteMany({ isWeeklyPlan: true });
    
    console.log('✅ Weekly Plans gelöscht:', result.deletedCount);
    
    return NextResponse.json({
      success: true,
      message: `✅ ${result.deletedCount} Weekly Plans zurückgesetzt`,
      deletedCount: result.deletedCount,
      resetBy: user.name
    });
    
  } catch (error: any) {
    console.error('❌ Reset error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error.message 
      },
      { status: 500 }
    );
  }
});