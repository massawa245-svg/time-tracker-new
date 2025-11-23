import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkSchedule from '@/models/WorkSchedule';

// ✅ GET - Holen des Arbeitsplans
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let query: any = { userId };
    
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      
      query.date = {
        $gte: startOfDay,
        $lt: endOfDay
      };
    } else if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 1);
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    } else {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
      query.date = {
        $gte: startOfDay,
        $lt: endOfDay
      };
    }

    const schedules = await WorkSchedule.find(query).sort({ date: 1 });

    // Falls kein Eintrag existiert, erstelle einen Default
    if (schedules.length === 0 && !month) {
      const defaultSchedule = await WorkSchedule.create({
        userId,
        date: new Date(),
        plannedStart: '09:00',
        plannedEnd: '17:00',
        plannedHours: 8,
        status: 'planned'
      });
      
      return NextResponse.json({ 
        success: true, 
        schedules: [defaultSchedule] 
      });
    }

    return NextResponse.json({ 
      success: true, 
      schedules 
    });
  } catch (error) {
    console.error('Work schedule fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// ✅ POST - Check-In oder neue Zeiterfassung
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { userId, date, action, actualStart, status = 'in-progress' } = body;

    if (!userId || !date) {
      return NextResponse.json({ 
        error: 'User ID and date required' 
      }, { status: 400 });
    }

    // Finde oder erstelle WorkSchedule
    let workSchedule = await WorkSchedule.findOne({ 
      userId, 
      date: new Date(date) 
    });
    
    if (!workSchedule) {
      workSchedule = await WorkSchedule.create({
        userId,
        date: new Date(date),
        plannedStart: '09:00',
        plannedEnd: '17:00', 
        plannedHours: 8,
        status: 'planned'
      });
    }

    const now = new Date();

    // INTELLIGENTE ZEITERFASSUNG MIT ACTION-BASIERTER LOGIK
    if (action) {
      // Alte Action-Logik (für Kompatibilität)
      switch (action) {
        case 'start':
          workSchedule.actualStart = now;
          workSchedule.status = 'in-progress';
          break;
          
        case 'end':
          workSchedule.actualEnd = now;
          
          if (workSchedule.actualStart) {
            let totalMs = now.getTime() - workSchedule.actualStart.getTime();
            
            // Subtrahiere Pausenzeit
            if (workSchedule.breaks && workSchedule.breaks.length > 0) {
              workSchedule.breaks.forEach(breakItem => {
                if (breakItem.end) {
                  totalMs -= breakItem.duration * 60 * 1000;
                }
              });
            }
            
            workSchedule.actualHours = Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
            workSchedule.overtime = workSchedule.actualHours - workSchedule.plannedHours;
          }
          workSchedule.status = 'completed';
          break;
          
        case 'break_start':
          if (!workSchedule.breaks) workSchedule.breaks = [];
          workSchedule.breaks.push({
            start: now,
            end: null,
            duration: 0
          });
          workSchedule.status = 'break';
          break;
          
        case 'break_end':
          if (workSchedule.breaks && workSchedule.breaks.length > 0) {
            const lastBreak = workSchedule.breaks[workSchedule.breaks.length - 1];
            lastBreak.end = now;
            lastBreak.duration = Math.round((now.getTime() - lastBreak.start.getTime()) / (1000 * 60));
          }
          workSchedule.status = 'in-progress';
          break;
      }
    } else {
      // Neue LiveTimeTracker Logik
      if (actualStart) {
        workSchedule.actualStart = actualStart;
        workSchedule.status = status;
      }
    }

    await workSchedule.save();

    return NextResponse.json({ 
      success: true, 
      workSchedule,
      message: action ? `Action ${action} completed` : 'Work schedule updated'
    });
  } catch (error) {
    console.error('Work schedule error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// ✅ PUT - Check-Out oder Update mit Berechnungen
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { 
      userId, 
      date, 
      actualEnd, 
      actualHours, 
      breakMinutes, 
      overtime, 
      efficiency, 
      status 
    } = body;

    if (!userId || !date) {
      return NextResponse.json({ 
        error: 'User ID and date required' 
      }, { status: 400 });
    }

    const workSchedule = await WorkSchedule.findOne({ 
      userId, 
      date: new Date(date) 
    });
    
    if (!workSchedule) {
      return NextResponse.json({ 
        error: 'Work schedule not found' 
      }, { status: 404 });
    }

    // INTELLIGENTE AUTO-BERECHNUNGEN
    const updates: any = {};

    if (actualEnd) updates.actualEnd = actualEnd;
    if (actualHours !== undefined) updates.actualHours = actualHours;
    if (breakMinutes !== undefined) updates.breakMinutes = breakMinutes;
    if (overtime !== undefined) updates.overtime = overtime;
    if (efficiency !== undefined) updates.efficiency = efficiency;
    if (status) updates.status = status;

    // Auto-Berechnung falls nicht provided
    if (workSchedule.actualStart && actualEnd && actualHours === undefined) {
      const startTime = new Date(workSchedule.actualStart).getTime();
      const endTime = new Date(actualEnd).getTime();
      const totalMs = endTime - startTime;
      const breakMs = (breakMinutes || workSchedule.breakMinutes || 0) * 60 * 1000;
      
      updates.actualHours = Math.round(((totalMs - breakMs) / (1000 * 60 * 60)) * 100) / 100;
    }

    // Auto-Überstunden Berechnung
    if (updates.actualHours !== undefined && overtime === undefined) {
      updates.overtime = updates.actualHours - workSchedule.plannedHours;
    }

    // Auto-Effizienz Berechnung
    if (updates.actualHours !== undefined && efficiency === undefined) {
      const planned = workSchedule.plannedHours || 8;
      updates.efficiency = Math.round((updates.actualHours / planned) * 100);
    }

    // Auto-Pausen-Erkennung
    if (updates.actualHours !== undefined && updates.actualHours > 6) {
      updates.autoBreak = true;
      if (!updates.breakMinutes || updates.breakMinutes < 30) {
        updates.breakMinutes = Math.max(updates.breakMinutes || 0, 30);
      }
    }

    // Update durchführen
    Object.assign(workSchedule, updates);
    await workSchedule.save();

    return NextResponse.json({ 
      success: true, 
      workSchedule,
      message: 'Work schedule updated with intelligent calculations'
    });
  } catch (error) {
    console.error('Work schedule update error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// ✅ DELETE - Work Schedule löschen (optional)
export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return NextResponse.json({ 
        error: 'Schedule ID required' 
      }, { status: 400 });
    }

    const result = await WorkSchedule.findByIdAndDelete(scheduleId);
    
    if (!result) {
      return NextResponse.json({ 
        error: 'Work schedule not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Work schedule deleted successfully' 
    });
  } catch (error) {
    console.error('Work schedule deletion error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}