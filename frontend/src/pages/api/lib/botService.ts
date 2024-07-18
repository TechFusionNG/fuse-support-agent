// import TelegramBot from 'node-telegram-bot-api';

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

  bot.on('message', (message: any) => {
    console.log('Received message:', message);

    const chatId = message.chat.id;
    const response = `You said: ${message.text}`;

    console.log('Sending response:', response);

    bot.sendMessage(chatId, response).catch((error: any) => {
      console.error('Error sending message:', error);
    });
  });

  console.log('Telegram Bot Service Initialized and polling started');
  return bot;
};

export const sendMessage = async (
  chatId: number,
  message: string,
  options?: any
) => {
  if (!bot) initializeBot();
  console.log('Sending message from UI:', message);
  await bot!.sendMessage(chatId, message, options);
};

export const getCommonGroups = async (userId: number): Promise<number[]> => {
  if (!bot) initializeBot();
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

export default initializeBot;
