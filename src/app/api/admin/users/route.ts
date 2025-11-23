import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/api-auth';

// GET - Alle User anzeigen (NUR ADMIN)
export const GET = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    await connectDB();
    
    console.log('🔐 Admin access by:', {
      userName: user.name,
      userEmail: user.email
    });

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    return Response.json({
      success: true,
      users: users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        position: u.position,
        isActive: u.isActive,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt
      }))
    });

  } catch (error: any) {
    console.error('Admin users fetch error:', error);
    return Response.json(
      { error: 'Interner Server Fehler' },
      { status: 500 }
    );
  }
});

// POST - Neuen User erstellen (NUR ADMIN)
export const POST = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password, role, department, position } = body;

    if (!name || !email || !password || !role) {
      return Response.json(
        { error: 'Name, E-Mail, Passwort und Rolle werden benötigt' },
        { status: 400 }
      );
    }

    // Prüfe ob User bereits existiert
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json(
        { error: 'Ein User mit dieser E-Mail existiert bereits' },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Wird automatisch gehasht durch das User Model
      role,
      department,
      position,
      isActive: true
    });

    return Response.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        position: newUser.position
      },
      message: 'User erfolgreich erstellt'
    });

  } catch (error: any) {
    console.error('User creation error:', error);
    return Response.json(
      { error: 'Interner Server Fehler' },
      { status: 500 }
    );
  }
});