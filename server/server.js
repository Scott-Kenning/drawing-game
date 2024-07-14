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
    origin: "*", // Allow all origins for local network
    // origin: "http://localhost:5173", // Allow all origins for local network
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "*", // Allow all origins for local network
  // origin: "http://localhost:5173", // Allow all origins for local network
  methods: ["GET", "POST"]
})); // Use CORS middleware

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('currentDrawing', drawingData);
    socket.emit('currentChat', chatMessages);
    socket.on('drawing', (data) => {
      drawingData.push(data);
      socket.broadcast.emit('drawing', data);
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
        players = players.filter(p => p.id !== socket.id);
        io.emit('updatePlayers', players); // Update player list after disconnection
    });

    socket.on('chatMessage', (message) => {
        chatMessages.push(message);
        io.emit('chatMessage', message);
        if (message.text.toLowerCase() === Prompts[currentPromptIndex].toLowerCase()) {
            io.emit('guess', { id: socket.id, text: message.text, correct: true });
        } else {
            io.emit('guess', { id: socket.id, text: message.text, correct: false });
        }
    });

    // Get new player
    socket.on('newPlayer', (player) => {
      const newPlayer = { id: socket.id, name: player.name, score: 0 };
      console.log(newPlayer);
        players.push(newPlayer);
        io.emit('newPlayerStored', players); // Broadcast updated player list to all clients
        if (players.length >= 2 && gameState === GameState.WAITING) {
            startGame();
        }
    });

    // console.log('new player');
    // const newPlayer = { id: socket.id, name: "Player", score: 0 };
    // players.push(newPlayer);
    // io.emit('newPlayer', players); // Broadcast updated player list to all clients
    // if (players.length >= 2 && gameState === GameState.WAITING) {
    //     startGame();
    // }
});

const startGame = () => {
    gameState = GameState.ACTIVE;
    nextTurn();
};

const nextTurn = () => {
    if (currentPromptIndex >= Prompts.length) {
        gameState = GameState.FINISHED;
        io.emit('gameFinished');
        return;
    }
    currentPrompt = Prompts[currentPromptIndex++];

    let artists = [];
    for (let j = 0; j < 2; j++) {
      const sortedPlayers = players.slice().sort((a, b) => a.timesDrawn - b.timesDrawn);
      // Find the closest player that isn't in the drawers list
      for (let i = 0; i < sortedPlayers.length; i++) {
          if (!artists.includes(sortedPlayers[i])) {
              artists.push(sortedPlayers[i]);
          }
      }
    }

    io.emit('newPrompt', currentPrompt);
    io.emit('setArtists', players);
    turnTimeout = setTimeout(nextTurn, 60000); // Move to the next prompt after 60 seconds
};

server.listen(3001, '0.0.0.0', () => {
  console.log('listening on *:3001');
});
