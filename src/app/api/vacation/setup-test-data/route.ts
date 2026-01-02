import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import VacationRequest from '../../models/VacationRequest';

export async function GET() {
  try {
    await connectDB();

    // Lösche vorhandene Test-Daten
    await VacationRequest.deleteMany({ userId: { $in: ['1', '2'] } });

    // Erstelle Test-Urlaubsanträge für Demo-User
    const testRequests = [
      {
        userId: '1',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-05'),
        type: 'vacation',
        reason: 'Winterurlaub',
        status: 'approved',
        daysRequested: 5,
      },
      {
        userId: '1', 
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-16'),
        type: 'sick',
        reason: 'Grippe',
        status: 'approved',
        daysRequested: 2,
      },
      {
        userId: '2',
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-12'),
        type: 'vacation',
        reason: 'Familienfeier',
        status: 'pending',
        daysRequested: 3,
      }
    ];

    await VacationRequest.insertMany(testRequests);

    return NextResponse.json({
      success: true,
      message: 'Test vacation requests created successfully',
      requests: testRequests
    });

  } catch (error) {
    console.error('Create test vacation requests error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
