import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();
    
    console.log(' Setting up test team members...');

    // Lösche vorhandene Test-User (optional)
    await User.deleteMany({ 
      email: { 
        $in: [
          'team.member1@company.com',
          'team.member2@company.com', 
          'team.manager@company.com'
        ]
      }
    });

    // Test-Team-Mitglieder erstellen
    const testUsers = [
      {
        name: 'Team Member 1',
        email: 'team.member1@company.com',
        password: await bcrypt.hash('password123', 12),
        role: 'employee',
        department: 'Development'
      },
      {
        name: 'Team Member 2', 
        email: 'team.member2@company.com',
        password: await bcrypt.hash('password123', 12),
        role: 'employee',
        department: 'Marketing'
      },
      {
        name: 'Team Manager',
        email: 'team.manager@company.com',
        password: await bcrypt.hash('password123', 12),
        role: 'manager',
        department: 'Management'
      }
    ];

    const createdUsers = await User.insertMany(testUsers);

    console.log(' Test team members created:', createdUsers.length);

    return NextResponse.json({
      success: true,
      message: `${createdUsers.length} test team members created successfully`,
      users: createdUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }))
    });

  } catch (error: any) {
    console.error(' Test team setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
