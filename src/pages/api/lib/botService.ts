
// lib/botService.ts

const TelegramBot = require('node-telegram-bot-api');

console.log('TRIGGER')
const TELEGRAM_TOKEN = process.env.NEXT_PUBLIC_ENV==='development' ? process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_DEV : process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_TOKEN) {
  throw new Error('TELEGRAM_TOKEN is not defined');
}
// In-memory store for groups (consider using a database for persistence)
const groups = new Set<number>();
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('polling_error', (error: any) => {
  console.error('Polling error:', error);
});

bot.on('message', (message: any) => {
  console.log('Received message:', message);

  // Handle incoming message
  const chatId = message.chat.id;
  const response = `You said: ${message.text}`;
  
  // Send response
  bot.sendMessage(chatId, response).catch((error: any) => {
    console.error('Error sending message:', error);
  });

  // Here you would store the message in Convex (this part will be done later)
});

export const sendMessage = async (
  chatId: number,
  message: string,
  options?: any
) => {
  await bot.sendMessage(chatId, message, options);
};
export const getCommonGroups = async (userId: number): Promise<number[]> => {
  const commonGroups: number[] = [];

  for (const groupId of groups) {
    try {
      const botMember = await bot.getChatMember(groupId, bot.id);
      const userMember = await bot.getChatMember(groupId, userId);

      if (botMember.status !== 'left' && userMember.status !== 'left') {
        commonGroups.push(groupId);
      }
    } catch (error) {
      console.error(`Error checking membership for group ${groupId}:`, error);
    }
  }

  return commonGroups;
};
