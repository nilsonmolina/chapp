// const debug = require('debug')('server:messages');
const db = require('../db/index');

const messages = {
  getAll: async () => {
    const q = `
      SELECT messages.body, messages."roomId", messages."dateCreated", users.username
      FROM messages
      INNER JOIN users
      ON messages."userId" = users.id`;
    const resp = await db.query(q);
    if (!resp) return [];

    return resp.rows;
  },

  createNew: async (msg) => {
    const q = `
      INSERT INTO messages ("userId", "roomId", body)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const resp = await db.query(q, [msg.userId, msg.roomId, msg.body]);
    if (!resp) return false;

    return resp.rows[0];
  },
};

module.exports = messages;
