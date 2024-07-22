import type { NextApiRequest, NextApiResponse } from 'next';
import { convex, api } from '../../../convex';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { group } = req.query;
    try {
      const messages = await convex.query(api.messages.getMessagesByGroup, { group: group as string });
      res.status(200).json({ messages });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
