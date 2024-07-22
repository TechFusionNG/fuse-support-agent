import type { NextApiRequest, NextApiResponse } from 'next/types';
import { sendMessage as sendTelegramMessage } from './lib/botService';
import { convex, api } from '../../../convex';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('TRIGGER');
  if (req.method === 'POST') {
    const { chatId, userId, type, content, agentTokenIdentifier } = req.body;
    const timestamp = Date.now();
    const from = 'agent';

    try {
      // Fetch the agent by their tokenIdentifier
      const agent: any = await convex.query(api.agents.getAgentByToken, { tokenIdentifier: agentTokenIdentifier });

      // Create the agent if they do not exist
      if (!agent) {
       const  newAgent = await convex.mutation(api.agents.addAgent, {
          name: agentTokenIdentifier,
          tokenIdentifier: agentTokenIdentifier,
        });
          // Store the reply message
      await convex.mutation(api.messages.addMessage, {
        userId: userId.toString(),
        from,
        type,
        content,
        timestamp,
        assignedAgentId: newAgent,
      });
      } else {
        const assignedAgentId = agent._id;
         // Store the reply message
      await convex.mutation(api.messages.addMessage, {
        userId: userId.toString(),
        from,
        type,
        content,
        timestamp,
        assignedAgentId,
      });


      }
      // Send the reply message to the user via Telegram
      if (type === 'text') {
        await sendTelegramMessage(chatId, content);
      } else {
        // Handle other types such as audio and image
        // ...
      }

      res.status(200).json({ status: 'message sent' });
    } catch (error) {
      console.error('Failed to send message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
