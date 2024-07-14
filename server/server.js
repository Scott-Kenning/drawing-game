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

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Send the current drawing data to the new client
  socket.emit('currentDrawing', drawingData);
  
  socket.on('drawing', (data) => {
    drawingData.push(data);
    socket.broadcast.emit('drawing', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
