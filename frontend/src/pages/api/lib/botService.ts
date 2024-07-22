import { convex, api } from '../../../../convex';
const TelegramBot = require('node-telegram-bot-api');

let bot: typeof TelegramBot | null = null;

const initializeBot = () => {
  if (bot) {
    console.log('Bot is already initialized');
    return bot;
  }

  console.log('Initializing Telegram Bot Service');
  console.log('Environment:', process.env.NEXT_PUBLIC_ENV);

  const TELEGRAM_TOKEN = process.env.NEXT_PUBLIC_ENV === 'development' 
    ? process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_DEV 
    : process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

  if (!TELEGRAM_TOKEN) {
    throw new Error('TELEGRAM_TOKEN is not defined');
  }

  bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

  bot.on('polling_error', (error: any) => {
    console.error('Polling error:', error);
  });

  bot.on('message', async (message: any) => {
    console.log('Received message:', message);
    const chatId = message.chat.id;
    const userName = message.chat.username || 'Anonymous';
    const groupName = 'YourGroupName'; // Replace with your logic to determine the group name
    const timestamp = Date.now();

    let user:any = await convex.query(api.users.getUserByToken, { tokenIdentifier: chatId.toString() });
    const messageType:any = message.text ? 'text' : (message.photo ? 'image' : (message.voice ? 'audio' : 'unknown'));
    let content = message.text || '';

    if (messageType === 'image') {
      content = message.photo[0].file_id;
    } else if (messageType === 'audio') {
      content = message.voice.file_id;
    }

    if (!user) {
      const newUserId = await convex.mutation(api.users.addUser, {
        name: userName,
        tokenIdentifier: chatId.toString(),
        groups: [groupName],
      });
      user = { _id: newUserId };
    }

    // Store the user message
    await convex.mutation(api.messages.addMessage, {
      userId: user._id,
      from: 'user',
      type: messageType,
      content,
      timestamp,
      assignedAgentId: null,
    });

    const response = `You said: ${message.text}`;
    console.log('Sending response:', response);

    bot.sendMessage(chatId, response).catch((error: any) => {
      console.error('Error sending message:', error);
    });
  });

  console.log('Telegram Bot Service Initialized and polling started');

  // Define the functions to be exported

  const sendMessage = async (
    chatId: number,
    message: string,
    options?: any
  ) => {
    console.log('Sending message from UI:', message);
    await bot!.sendMessage(chatId, message, options);
  };

  const getCommonGroups = async (userId: number): Promise<number[]> => {
    const commonGroups: number[] = [];
    const groups = new Set<number>(); // Add logic to populate this set

    for (const groupId of groups) {
      try {
        const botMember = await bot!.getChatMember(groupId, bot!.id);
        const userMember = await bot!.getChatMember(groupId, userId);

        if (botMember.status !== 'left' && userMember.status !== 'left') {
          commonGroups.push(groupId);
        }
      } catch (error) {
        console.error(`Error checking membership for group ${groupId}:`, error);
      }
    }

    return commonGroups;
  };

  return { sendMessage, getCommonGroups };
};

// Initialize the bot and export the functions
const botInstance = initializeBot();
export const { sendMessage, getCommonGroups } = botInstance;
export default initializeBot;
