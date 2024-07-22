import type { NextApiRequest, NextApiResponse } from 'next';
import { convex, api } from '../../../convex';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, tokenIdentifier, groups } = req.body;
    try {
      const userId = await convex.mutation(api.users.addUser, { name, tokenIdentifier, groups });
      res.status(200).json({ userId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
