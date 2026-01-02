import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import User from '@models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🔗 Versuche MongoDB Verbindung...');
    await connectDB();
    console.log('✅ MongoDB connected');

    // Test-User Daten mit gehashten Passwörtern
    const testUsers = [
      {
        name: "Admin User",
        email: "admin@company.com",
        password: await bcrypt.hash('admin123', 12),
        role: "admin",
        department: "IT",
        position: "System Administrator",
        timezone: "Europe/Berlin",
        isActive: true,
        lastLogin: new Date()
      },
      {
        name: "David Manager", 
        email: "david.manager@company.com",
        password: await bcrypt.hash('manager123', 12),
        role: "manager", 
        department: "Operations",
        position: "Teamleiter",
        timezone: "Europe/Berlin", 
        isActive: true,
        lastLogin: new Date()
      },
      {
        name: "Solomon Employee",
        email: "solomon.employee@company.com",
        password: await bcrypt.hash('employee123', 12), 
        role: "employee",
        department: "Development",
        position: "Software Engineer",
        timezone: "Europe/Berlin",
        isActive: true,
        lastLogin: new Date()
      },
      {
        name: "Anna HR Manager",
        email: "anna.hr@company.com", 
        password: await bcrypt.hash('hrmanager123', 12),
        role: "manager",
        department: "Human Resources",
        position: "HR Manager", 
        timezone: "Europe/Berlin",
        isActive: true,
        lastLogin: new Date()
      }
    ];

    // Lösche vorhandene Test-User
    console.log('🗑️ Lösche alte Test-User...');
    const deleteResult = await User.deleteMany({
      email: { 
        $in: testUsers.map(user => user.email)
      }
    });
    
    console.log(`✅ Gelöschte User: ${deleteResult.deletedCount}`);

    // Erstelle neue Test-User
    console.log('👤 Erstelle neue Test-User...');
    const createdUsers = await User.insertMany(testUsers);
    
    console.log(`✅ Test-User erstellt: ${createdUsers.length}`);

    return NextResponse.json({
      success: true,
      message: 'Test-User erfolgreich erstellt!',
      users: createdUsers.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }))
    });

  } catch (error: any) {
    console.error('❌ Setup Test Users error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'MongoDB Fehler',
        details: error.message,
        hint: 'Prüfe ob MongoDB läuft und Model korrekt ist'
      },
      { status: 500 }
    );
  }
}

// GET für Browser-Test
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST method to create test users',
    test_users: [
      { email: 'admin@company.com', password: 'admin123', role: 'admin' },
      { email: 'david.manager@company.com', password: 'manager123', role: 'manager' },
      { email: 'solomon.employee@company.com', password: 'employee123', role: 'employee' }
    ]
  });
}