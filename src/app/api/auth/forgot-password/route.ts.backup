import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'E-Mail Adresse ist erforderlich',
        },
        { status: 400 }
      );
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige E-Mail Adresse',
        },
        { status: 400 }
      );
    }

    console.log(' Password reset requested for email:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Aus Sicherheitsgründen nicht verraten ob User existiert
      console.log('ℹ  User not found for email:', email, '(security response)');
      return NextResponse.json({
        success: true,
        message: 'Falls ein Konto mit dieser E-Mail existiert, wurde ein Reset-Link gesendet.',
      });
    }

    console.log('✅ User found:', user.email);

    // Lösche alte Reset-Tokens für diesen User
    await PasswordResetToken.deleteMany({ 
      userId: user._id 
    });

    // Generiere Reset Token
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 Stunde

    // Speichere Reset Token
    await PasswordResetToken.create({
      token: resetToken,
      userId: user._id,
      expiresAt,
    });

    console.log(' Reset Token created for user:', user.email);
    console.log(' Expires at:', expiresAt.toLocaleString('de-DE'));

    // Sende Email via SMTP
    console.log(' Attempting to send email via Brevo SMTP...');
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      // Lösche Token falls Email nicht gesendet werden konnte
      await PasswordResetToken.deleteOne({ token: resetToken });
      
      console.log(' Email sending failed for:', email);
      
      return NextResponse.json(
        {
          success: false,
          message: 'E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut.',
        },
        { status: 500 }
      );
    }

    console.log(' Password reset process completed for:', email);
    
    return NextResponse.json({
      success: true,
      message: 'Falls ein Konto mit dieser E-Mail existiert, wurde ein Reset-Link gesendet.',
    });

  } catch (error: any) {
    console.error(' Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Interner Server Fehler: ' + error.message,
      },
      { status: 500 }
    );
  }
}
