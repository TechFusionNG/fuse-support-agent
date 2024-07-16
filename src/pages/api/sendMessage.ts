// pages/api/sendMessage.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { sendMessage } from './lib/botService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('TRIGGER'   )
  if (req.method === 'POST') {
    const { chatId, message } = req.body;
    
    try {
      await sendMessage(chatId, message);
      res.status(200).json({ status: 'message sent' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
