// src/app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log(' Testing Brevo SMTP connection...');
    
    // Überprüfe ob Environment Variables gesetzt sind
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
      console.error(' SMTP credentials missing in environment variables');
      return NextResponse.json({
        success: false,
        error: 'SMTP credentials missing',
        details: 'BREVO_SMTP_USER and BREVO_SMTP_PASS must be set in .env.local'
      }, { status: 500 });
    }

    console.log(' SMTP User:', process.env.BREVO_SMTP_USER);
    console.log(' SMTP Pass length:', process.env.BREVO_SMTP_PASS?.length);

    // Test Transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    console.log(' Testing SMTP connection...');
    
    // Test connection
    await transporter.verify();
    console.log(' SMTP connection verified successfully!');

    return NextResponse.json({
      success: true,
      message: 'SMTP connection working! Brevo configuration is correct.',
      details: {
        host: 'smtp-relay.brevo.com',
        port: 587,
        user: process.env.BREVO_SMTP_USER?.substring(0, 10) + '...',
        status: 'connected'
      }
    });
    
  } catch (error: any) {
    console.error(' SMTP test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Check Brevo SMTP credentials and configuration',
      troubleshooting: [
        'Verify BREVO_SMTP_USER and BREVO_SMTP_PASS in .env.local',
        'Check if Brevo account is activated',
        'Verify SMTP settings in Brevo dashboard',
        'Check firewall/network restrictions'
      ]
    }, { status: 500 });
  }
}
