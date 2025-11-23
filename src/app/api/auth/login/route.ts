import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide email and password',
        },
        { status: 400 }
      );
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // ✅ WICHTIG: Füge role und alle benötigten Felder hinzu!
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role, // ← DAS WAR VERGESSEN!
      department: user.department,
      position: user.position,
      timezone: user.timezone,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    };

    console.log('✅ Login successful:', { 
      name: user.name, 
      role: user.role,
      email: user.email 
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}