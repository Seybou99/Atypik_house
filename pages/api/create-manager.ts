import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prisma'; // Ajustez le chemin en fonction de votre structure de projet
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const manager = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: 'MANAGER', // Ajout du rôle MANAGER
      },
    });
    res.status(201).json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create manager', error });
  }
}
