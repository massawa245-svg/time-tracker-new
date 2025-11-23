import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VacationRequest from '@/models/VacationRequest';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    let query = {};
    
    // Wenn userId vorhanden: Zeige nur Requests dieses Users
    if (userId) {
      query = { userId };
    }
    
    // Wenn status Filter: Füge Status zum Query hinzu
    if (status) {
      query = { ...query, status };
    }
    
    // Wenn weder userId noch status: Zeige ALLE Requests (für Manager)
    const requests = await VacationRequest.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      requests: requests.map(req => ({
        ...req,
        _id: req._id.toString(),
        startDate: req.startDate.toISOString().split('T')[0],
        endDate: req.endDate.toISOString().split('T')[0],
        createdAt: req.createdAt.toISOString()
      }))
    });

  } catch (error) {
    console.error('Vacation API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, startDate, endDate, type, reason, notes } = body;
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID is required',
        },
        { status: 400 }
      );
    }
    
    // Berechne Anzahl Tage
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const vacationRequest = new VacationRequest({
      userId,
      startDate: start,
      endDate: end,
      type: type || 'vacation',
      reason,
      notes: notes || '',
      daysRequested,
      status: 'pending'
    });
    
    await vacationRequest.save();
    
    return NextResponse.json({
      success: true,
      message: 'Vacation request created successfully',
      request: vacationRequest
    });

  } catch (error) {
    console.error('Create vacation request error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { requestId, status, approvedBy } = body;
    
    if (!requestId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: 'Request ID and status are required',
        },
        { status: 400 }
      );
    }
    
    const updateData: any = { status };
    
    if (status === 'approved' && approvedBy) {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
    }
    
    const updatedRequest = await VacationRequest.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    );
    
    if (!updatedRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vacation request not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Vacation request ${status} successfully`,
      request: updatedRequest
    });

  } catch (error) {
    console.error('Update vacation request error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
