import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import PasswordResetToken from '../../models/PasswordResetToken';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token and password are required',
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters',
        },
        { status: 400 }
      );
    }

    // Find valid reset token
    const resetToken = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
    }).populate('userId');

    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired reset token',
        },
        { status: 400 }
      );
    }

    // Update user password
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    user.password = password;
    await user.save();

    // Delete used reset token
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}