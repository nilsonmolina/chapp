const debug = require('debug')('server');
const redis = require('redis');
const socketRedis = require('socket.io-redis');
const socketio = require('socket.io');
const bcrypt = require('bcrypt');
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
const redisClient = redis.createClient();

io.adapter(socketRedis({ host: 'localhost', port: 6379 }));

// REDIS CONNECTION EVENTS
redisClient.on('connect', () => debug('Redis client connected'));

redisClient.on('error', (err) => {
  debug(`Something went wrong ${err}`);
});

// WEBSOCKET CALLS
const users = [];
io.on('connection', (socket) => {
  debug(`Client connected - ${socket.id}`);

  socket.on('tryLogin', async (payload) => {
    const user = await usersDB.getByUsername(payload.username);
    if (!user) {
      socket.emit('incorrectLogin', 'Wrong username or password');
      return;
    }
    const match = await bcrypt.compare(payload.password, user.password);
    if (!match) {
      socket.emit('incorrectLogin', 'Wrong username or password');
      return;
    }

    await login(socket, user);
  });

  socket.on('trySignup', async (payload) => {
    try {
      let user = await usersDB.getByUsername(payload.username);
      if (user) {
        socket.emit('usernameTaken', `"${payload.username}" already taken.`);
        return;
      }

      const hash = await bcrypt.hash(payload.password, 10);

      user = await usersDB.createNew(payload.username, hash);
      await login(socket, user);
    } catch (e) { socket.emit('incorrectLogin', 'Server Error!'); }
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

    io.emit('usersChanged', redisClient.S);
  });


  // HELPER FUNCTIONS
  async function login(currSocket, user) {
    // if (users.find(u => u.name === user.username)) {
    //   socket.emit('usernameTaken', `"${user.username}" already logged in.`);
    //   return;
    // }

    users.push({ socketId: currSocket.id, name: user.username, id: user.id });
    debug(`NEW USER: ${user.username} - ${currSocket.id}`);
    debug(users);

    const rooms = await roomsDB.getByUserId(user.id);
    const messages = await messagesDB.getAll();
    currSocket.emit('usernameAccepted', { username: user.username, messages, rooms });

    io.emit('usersChanged', users);
  }

  // REDIS FUNCTIONS
});
