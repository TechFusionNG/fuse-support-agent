"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
const wss = new ws_1.WebSocketServer({ port: PORT });
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
app.get('/status', (req, res) => {
    res.send('I am alive');
});
const HTTP_PORT = process.env.HTTP_PORT || 8081;
app.listen(HTTP_PORT, () => {
    console.log(`HTTP server is running on http://localhost:${HTTP_PORT}`);
});
