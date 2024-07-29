import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prisma'; // Adjust the import based on your structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
