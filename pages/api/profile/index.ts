// pages/api/profile/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/libs/prismadb'; // Ajustez le chemin selon votre structure
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const email = session.user.email;

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load profile' });
      }
      break;
    case 'PUT':
      try {
        const { name, image } = req.body;
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { name, image },
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
      }
      break;
    case 'DELETE':
      try {
        await prisma.user.delete({
          where: { email },
        });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
