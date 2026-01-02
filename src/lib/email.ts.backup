// src/lib/email.ts - Mit verifiziertem Gmail Sender
import nodemailer from 'nodemailer';

// SMTP Transporter erstellen
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });
};

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  let resetLink = '';
  
  try {
    resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    console.log(' Sending password reset email to:', email);
    console.log('Reset Link:', resetLink);

    const transporter = createTransporter();
    
    // VERWENDE DEINE VERIFIZIERTE GMAIL ALS SENDER
    const fromEmail = process.env.SMTP_FROM || 'massawa245@gmail.com';
    const fromName = process.env.SMTP_FROM_NAME || 'TimeTracker Pro';
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Passwort zurücksetzen - TimeTracker Pro',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2563eb 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { color: white; margin: 0; font-size: 24px; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>TimeTracker Pro</h1>
            </div>
            <div class="content">
                <h2>Passwort zurücksetzen</h2>
                <p>Hallo,</p>
                <p>du hast einen Passwort-Reset für dein TimeTracker Pro Konto angefordert.</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" class="button">Passwort zurücksetzen</a>
                </p>
                <p>Oder kopiere diesen Link in deinen Browser:</p>
                <p style="background: #e5e7eb; padding: 10px; border-radius: 5px; word-break: break-all;">
                    ${resetLink}
                </p>
                <p><strong>Der Link ist 1 Stunde gültig.</strong></p>
                <p>Falls du keinen Passwort-Reset angefordert hast, ignoriere diese Email einfach.</p>
                <div class="footer">
                    <p>Dein TimeTracker Pro Team</p>
                    <p>Wenn du Probleme hast, antworte einfach auf diese Email.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
Passwort zurücksetzen - TimeTracker Pro

Hallo,

du hast einen Passwort-Reset für dein TimeTracker Pro Konto angefordert.

Klicke auf diesen Link um dein Passwort zurückzusetzen:
${resetLink}

Der Link ist 1 Stunde gültig.

Falls du keinen Passwort-Reset angefordert hast, ignoriere diese Email einfach.

Dein TimeTracker Pro Team
      `
    };

    console.log(' Sending email with verified sender:', fromEmail);
    const result = await transporter.sendMail(mailOptions);
    
    console.log(' Password reset email sent successfully!');
    console.log(' From:', fromEmail);
    console.log(' To:', email);
    console.log(' Message ID:', result.messageId);
    
    return true;
    
  } catch (error: any) {
    console.error(' SMTP email error:', error);
    
    // Fallback: Log the reset link for development
    console.log(' DEVELOPMENT FALLBACK - Reset Link:', resetLink);
    
    return false;
  }
}

export async function sendWelcomeEmail(email: string, userName: string) {
  try {
    const transporter = createTransporter();
    
    const fromEmail = process.env.SMTP_FROM || 'massawa245@gmail.com';
    const fromName = process.env.SMTP_FROM_NAME || 'TimeTracker Pro';
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Willkommen bei TimeTracker Pro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Willkommen bei TimeTracker Pro!</h2>
          <p>Hallo ${userName},</p>
          <p>Herzlich willkommen bei TimeTracker Pro - deiner professionellen Lösung für Zeiterfassung!</p>
          <p>Starte jetzt mit der effizienten Zeiterfassung für dein Team.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(' Welcome email sent to:', email);
    return true;
    
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
}
