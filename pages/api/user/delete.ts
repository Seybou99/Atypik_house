import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/app/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await prisma.user.delete({
      where: {
        email: session.user?.email || undefined,
      },
    });
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
}
