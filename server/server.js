const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Update to match your React app URL
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:5173", // Update to match your React app URL
  methods: ["GET", "POST"]
})); // Use CORS middleware

app.use(express.static('public'));

let drawingData = [];
let chatMessages = [
  { id: 1, text: 'Hello! Welcome to the game.', sender: 'System' }
]; // Store chat messages

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
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
