import type { NextApiRequest, NextApiResponse } from 'next';
import initializeBot from './lib/botService';

let bot : any = null;


const startBot = (req: NextApiRequest, res: NextApiResponse) => {
  if (!bot) {
    bot = initializeBot();
  }
  res.status(200).json({ message: 'Bot is running' });
};

export default startBot;