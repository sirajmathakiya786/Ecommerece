const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 4040;

io.on('connection', (socket) => {

  console.log('A user connected');

  socket.on('chat message', (msg) => {
    console.log('Received message:', msg);
    io.emit('chat message', msg);
  });

  // console.log(`New User id ${socket.id}`)
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
