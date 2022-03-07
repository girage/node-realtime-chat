const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3050;
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Run when client connect
io.on('connection', socket => {

  // Welcome user to the chat
  socket.emit('message', 'Welcome to ChatCord!!');

  // broadcast to user connects
  socket.broadcast.emit('message', 'A user has joined the chat');

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  })

  // Listen to chat message
  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  })

})

app.get('/', (req, res) => {
  res.send('Hello');
});


const start = () => {
  try {
    server.listen(PORT, () => {
      console.log(`Listening for port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();