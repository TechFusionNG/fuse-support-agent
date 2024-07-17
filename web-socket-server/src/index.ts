import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import express from 'express';


dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
const wss = new WebSocketServer({ port: PORT as number });

// WebSocket server setup
wss.on('connection', (ws) => {
  ws.on('error', console.error);
    
  ws.on('message', (data) => {
    console.log('received: %s', data);
  });

  ws.send('Welcome to the WebSocket server');
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

// HTTP server setup
app.get('/status', (req: any , res: any) => {
  res.send('I am alive');
});

const HTTP_PORT = process.env.HTTP_PORT || 8081;
app.listen(HTTP_PORT, () => {
  console.log(`HTTP server is running on http://localhost:${HTTP_PORT}`);
});
