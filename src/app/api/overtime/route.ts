import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OvertimeBalance from '@/models/OvertimeBalance';
import WorkSchedule from '@/models/WorkSchedule';

// GET - Monatliche Überstundenbilanz
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month') || getCurrentMonth();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Hole oder erstelle Überstundenbilanz
    let balance = await OvertimeBalance.findOne({ userId, month });
    
    if (!balance) {
      balance = await calculateMonthlyOvertime(userId, month);
    }

    // Hole tägliche Details
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);
    
    const dailySchedules = await WorkSchedule.find({
      userId,
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: 1 });

    const dailyOvertime = dailySchedules.map(schedule => ({
      date: schedule.date,
      planned: schedule.plannedHours,
      actual: schedule.actualHours || 0,
      overtime: schedule.overtime || 0,
      status: schedule.status
    }));

    return NextResponse.json({
      success: true,
      balance: {
        month: balance.month,
        monthName: balance.monthName,
        plannedHours: balance.plannedHours,
        actualHours: balance.actualHours,
        overtime: balance.overtime,
        currentBalance: balance.currentBalance,
        dailyBreakdown: dailyOvertime
      }
    });
  } catch (error) {
    console.error('Overtime fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Hilfsfunktion zur Berechnung der monatlichen Überstunden
async function calculateMonthlyOvertime(userId: string, month: string) {
  const [year, monthNum] = month.split('-').map(Number);
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 1);
  
  // Hole alle WorkSchedules für den Monat
  const schedules = await WorkSchedule.find({
    userId,
    date: { $gte: startDate, $lt: endDate }
  });
  
  // Berechne Gesamtwerte
  const plannedHours = schedules.reduce((sum, schedule) => sum + schedule.plannedHours, 0);
  const actualHours = schedules.reduce((sum, schedule) => sum + (schedule.actualHours || 0), 0);
  const overtime = actualHours - plannedHours;
  
  // Monatsnamen
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  
  // Erstelle oder aktualisiere Balance
  const balance = await OvertimeBalance.findOneAndUpdate(
    { userId, month },
    {
      userId,
      month,
      year,
      monthName: monthNames[monthNum - 1],
      plannedHours,
      actualHours,
      overtime,
      currentBalance: overtime
    },
    { upsert: true, new: true }
  );
  
  return balance;
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
}