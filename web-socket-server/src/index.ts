import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT as number});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    ws.send(`You said: ${message}`); // Immediate auto-reply
  });

  ws.on('error', console.error);

  ws.send('Welcome to the WebSocket server');
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
