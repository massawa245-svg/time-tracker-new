import { NextRequest } from 'next/server';
import connectDB from '@lib/mongodb';
import WorkSchedule from '@models/WorkSchedule';
import { requireManager } from '@lib/api-auth';

// GET - Team Stundenpläne anzeigen (NUR MANAGER)
export const GET = requireManager(async (request: NextRequest, user: any) => {
  try {
    await connectDB();
    
    console.log('👑 Manager accessing team schedules:', {
      manager: user.name,
      department: user.department
    });

    const teamSchedules = await WorkSchedule.find({
      isWeeklyPlan: false,
      date: { 
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)) 
      }
    })
    .populate('userId', 'name email department')
    .sort({ date: -1 })
    .limit(50);

    return Response.json({
      success: true,
      schedules: teamSchedules.map(schedule => ({
        id: schedule._id.toString(),
        date: schedule.date,
        userId: schedule.userId?._id,
        userName: schedule.userId?.name,
        userEmail: schedule.userId?.email,
        department: schedule.userId?.department,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        hours: schedule.hours,
        status: schedule.status
      }))
    });

  } catch (error: any) {
    console.error('Team schedules fetch error:', error);
    return Response.json(
      { error: 'Interner Server Fehler' },
      { status: 500 }
    );
  }
});