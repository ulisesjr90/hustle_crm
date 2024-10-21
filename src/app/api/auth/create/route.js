import prisma from '@/lib/prisma'; // Adjust based on your path setup
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the data from the request body
    const { uid, email, name, role, mapPreference } = await request.json();

    console.log('Data received for creating user:', { uid, email, name, role, mapPreference });

    // Create the user in the MySQL database using Prisma
    const newUser = await prisma.user.create({
      data: {
        uid,
        email,
        name,
        role,
        preferences: {
          create: {
            mapPreference,  // Handle map preference during user creation
          },
        },
      },
    });

    console.log('User created successfully:', newUser);

    // Return the new user with a 201 status
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user in the database:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
