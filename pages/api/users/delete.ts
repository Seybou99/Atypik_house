import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prisma'; // Ajustez le chemin selon votre structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    console.log('Received DELETE request for ID:', id); // Ajout d'un log pour vérifier l'ID

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    try {
      const user = await prisma.user.delete({
        where: { id },
      });
      res.status(200).json(user);
    } catch (error) {
      console.error('Failed to delete user:', error);
      res.status(500).json({ message: 'Failed to delete user', error });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
