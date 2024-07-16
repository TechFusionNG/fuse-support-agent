// pages/api/messages.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data for demonstration purposes
const messages = [
  {
    chatId: 5870036382,
    username: 'Ray',
    messages: [
      { from: 'user1', text: 'Hello!' },
      { from: 'agent', text: 'Hi! How can I help you?' },
    ],
  },
  {
    chatId: 1817436288,
    username: 'Matt',
    messages: [
      { from: 'user2', text: 'Hi!' },
      { from: 'agent', text: 'Hello! How can I assist you?' },
    ],
  },
  {
    chatId: 5692996314,
    username: 'Gabe',
    messages: [
      { from: 'user2', text: 'Hi!' },
      { from: 'agent', text: 'Hello! How can I assist you?' },
    ],
  },
  {
    chatId: 1557225323,
    username: 'Modups',
    messages: [
      { from: 'user2', text: 'Hi!' },
      { from: 'agent', text: 'Hello! How can I assist you?' },
    ],
  },
];

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ messages });
};
