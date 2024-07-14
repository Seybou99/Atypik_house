import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // Valider les champs requis
    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Email, name, and password are required' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer un nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
