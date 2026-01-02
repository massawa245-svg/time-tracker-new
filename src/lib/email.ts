// Email feature disabled for build
export async function sendEmail(to: string, subject: string, html: string) {
  console.log(`[EMAIL DISABLED] Would send to ${to}: ${subject}`);
  return { success: true, message: 'Email disabled for build' };
}
