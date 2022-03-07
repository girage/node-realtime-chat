const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, } = require('./utils/users');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3050;
const server = http.createServer(app);
const io = socketio(server);

const botName = 'Auto-Bot'
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Run when client connect
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome user to the chat
    socket.emit('message', formatMessage(botName, `Welcome ${user.username} to ChatCord!!`));

    // broadcast to user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `A ${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUser', {
      room: user.room,
      users: getRoomUsers(user.room),
    });

  });

  // Listen to chat message
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  })

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io
        .to(user.room)
        .emit('message', formatMessage(botName, `A ${user.username} has left the chat`));
    };
    
    // Send users and room info
    io.to(user.room).emit('roomUser', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  })
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