const debug = require('debug')('server');
const socketio = require('socket.io');
const express = require('express');

const usersDB = require('./models/users');
const messagesDB = require('./models/messages');
const roomsDB = require('./models/rooms');

// SETUP
const app = express();
const port = process.env.PORT || 5000;

// ROUTES
app.get('/api/headers', (req, res) => {
  res.json({ headers: req.headers, address: req.connection.remoteAddress });
});

// START SERVER
const server = app.listen(port, '127.0.0.1', () => console.log(`Listening on port ${port}...`));
const io = socketio.listen(server);

// WEBSOCKET CALLS
const users = [];
io.on('connection', (socket) => {
  debug(`Client connected - ${socket.id}`);

  socket.on('tryLogin', async (payload) => {
    const user = await usersDB.authenticate(payload.username, payload.password);
    if (!user) {
      socket.emit('incorrectLogin', 'Wrong username or password');
      return;
    }

    await login(socket, user);
  });

  socket.on('trySignup', async (payload) => {
    let user = await usersDB.getByUsername(payload.username);
    if (user) {
      socket.emit('usernameTaken', `"${payload.username}" already taken.`);
      return;
    }

    user = await usersDB.createNew(payload.username, payload.password);
    await login(socket, user);
  });

  socket.on('createMessage', async (payload) => {
    const user = users.find(u => u.socketId === socket.id);
    if (!user) return;

    const message = { userId: user.id, roomId: payload.roomId, body: payload.body };
    debug(message);
    const newMessage = await messagesDB.createNew(message);
    newMessage.username = user.name;

    io.emit('messageCreated', newMessage);
  });

  socket.on('disconnect', () => {
    debug(`Client disconnected - ${socket.id}`);

    const userIndex = users.findIndex(u => u.socketId === socket.id);
    if (userIndex > -1) users.splice(userIndex, 1);
    debug(`USER DISCONNECTED: ${socket.id}`);
    debug(users);

    io.emit('usersChanged', users);
  });


  async function login(currSocket, user) {
    if (users.find(u => u.name === user.username)) {
      socket.emit('usernameTaken', `"${user.username}" already logged in.`);
      return;
    }

    users.push({ socketId: currSocket.id, name: user.username, id: user.id });
    debug(`NEW USER: ${user.username} - ${currSocket.id}`);
    debug(users);

    const rooms = await roomsDB.getByUserId(user.id);
    const messages = await messagesDB.getAll();
    currSocket.emit('usernameAccepted', { username: user.username, messages, rooms });

    io.emit('usersChanged', users);
  }
});
