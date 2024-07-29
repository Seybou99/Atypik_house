// pages/api/listings/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const listings = await prisma.listing.findMany();
      res.status(200).json(listings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch listings' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
