import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('currentUser');
    
    if (userCookie) {
      const user = JSON.parse(userCookie.value);
      return NextResponse.json({
        success: true,
        user: user
      });
    }
    
    return NextResponse.json({
      success: false,
      user: null,
      message: 'Not authenticated'
    });
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      success: false,
      user: null,
      error: 'Internal server error'
    });
  }
}