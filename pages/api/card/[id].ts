// pages/api/listings/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const deletedListing = await prisma.listing.delete({
        where: { id: id as string },
      });
      res.status(200).json(deletedListing);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete listing' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
