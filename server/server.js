const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const GameState = Object.freeze({
    ACTIVE: "active",
    WAITING: "waiting",
    FINISHED: "finished"
});

let drawingData = [];
let chatMessages = [
  { id: 1, text: 'Hello! Welcome to the game.', sender: 'System' }
]; // Store chat messages

const Prompts = ['horse', 'beaver', 'chicken'];
let currentPromptIndex = 0;
let gameState = GameState.WAITING;
let players = [];
let turnTimeout = null;

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}));
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');
    // Send the current drawing data to the new client
    socket.emit('currentDrawing', drawingData);
  
    // Send the current chat messages to the new client
    socket.emit('currentChat', chatMessages);
  
    socket.on('drawing', (data) => {
      drawingData.push(data);
      socket.broadcast.emit('drawing', data);
    });
  
    socket.on('chatMessage', (message) => {
      chatMessages.push(message);
      io.emit('chatMessage', message);
      io.emit('guess', { id: socket.id, text: message.text });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        players = players.filter(p => p.id !== socket.id);
        io.emit('updatePlayers', players);
    });

    socket.on('requestStartGame', () => {
        if (gameState === GameState.WAITING) {
            startGame();
        }
    });

    const newPlayer = { id: socket.id, name: "Player" };
    players.push(newPlayer);
    io.emit('newPlayer', players);
    if (players.length >= 2 && gameState === GameState.WAITING) {
        startGame();
    }
});

const startGame = () => {
    gameState = GameState.ACTIVE;
    currentPromptIndex = 0;
    if (currentPromptIndex >= Prompts.length) {
        gameState = GameState.FINISHED;
        io.emit('gameFinished');
        return;
    }
    const currentPrompt = Prompts[currentPromptIndex++];
    io.emit('newPrompt', currentPrompt);
    setTimeout(nextTurn, 60000); // Move to the next prompt after 60 seconds
};

server.listen(3001, () => {
    console.log('listening on *:3001');
});
