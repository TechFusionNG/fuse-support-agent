import { WebSocketServer } from 'ws';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

// Create an HTTP server.
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Create a WebSocket server.
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections.
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  ws.send('Welcome to the WebSocket server');
});

// Upgrade HTTP connections to WebSocket.
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
