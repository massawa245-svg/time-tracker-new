import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  department?: string;
  position?: string;
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('currentUser');
    
    if (userCookie && userCookie.value) {
      console.log('🔐 Found user cookie');
      const user = JSON.parse(userCookie.value);
      
      // ✅ FIX: Stelle sicher dass user.id existiert
      if (!user.id) {
        console.log('⚠️ User has no id, generating one...');
        user.id = 'user-' + Date.now(); // Fallback ID
      }
      
      console.log('✅ User data:', { id: user.id, name: user.name, role: user.role });
      return user;
    }

    console.log('❌ No user cookie found');
    return null;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

// ✅ KORREKTE EXPORTS - als named exports
export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await getAuthUser(request);
    
    if (!user) {
      console.log('🚫 No authenticated user');
      return Response.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }
    
    console.log('✅ Authenticated user:', user.name, user.role);
    return handler(request, ...args, user);
  };
}

export function requireManager(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await getAuthUser(request);
    
    if (!user) {
      return Response.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }
    
    if (user.role !== 'manager' && user.role !== 'admin') {
      console.log('🚫 Access denied for role:', user.role);
      return Response.json(
        { error: 'Zugriff verweigert. Nur für Manager.' },
        { status: 403 }
      );
    }
    
    console.log('👑 Manager access granted for:', user.name);
    return handler(request, ...args, user);
  };
}

export function requireAdmin(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await getAuthUser(request);
    
    if (!user) {
      return Response.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }
    
    if (user.role !== 'admin') {
      console.log('🚫 Access denied for role:', user.role);
      return Response.json(
        { error: 'Zugriff verweigert. Nur für Administratoren.' },
        { status: 403 }
      );
    }
    
    console.log('⚡ Admin access granted for:', user.name);
    return handler(request, ...args, user);
  };
}