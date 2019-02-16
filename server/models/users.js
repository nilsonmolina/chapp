// const debug = require('debug')('server:users');
const db = require('../db/index');

const users = {
  getAll: async () => {
    const { rows } = await db.query('SELECT * FROM users');

    return rows;
  },

  getByID: async (id) => {
    const userId = parseInt(id, 10);
    if (Number.isNaN(userId)) return [];

    const query = 'SELECT * FROM users WHERE id=$1';
    const { rows } = await db.query(query, [userId]);
    if (rows.length < 1) return [];

    return rows;
  },

  getByUsername: async (username) => {
    const query = 'SELECT * FROM users WHERE username=$1';
    const { rows } = await db.query(query, [username]);
    if (rows.length < 1) return false;

    return rows[0];
  },

  createNew: async (username, password) => {
    // CREATE USER
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username, id';
    const { rows } = await db.query(query, [username, password]);
    if (rows.length < 1) return false;

    // ADD USER TO GLOBAL CHATROOM
    const q = 'INSERT INTO "roomUsers" ("userId", "roomId") VALUES ($1, $2) RETURNING *';
    await db.query(q, [rows[0].id, 1]);

    return rows[0];
  },

  authenticate: async (username, password) => {
    const query = 'SELECT * FROM users WHERE username=$1 AND password=$2';
    const { rows } = await db.query(query, [username, password]);
    if (rows.length < 1) return false;

    return rows[0];
  },
};

module.exports = users;
