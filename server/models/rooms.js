// const debug = require('debug')('server:messages');
const db = require('../db/index');

const rooms = {
  getByUserId: async (userId) => {
    const q = `
      SELECT rooms.*
      FROM rooms
      INNER JOIN "roomUsers"
      ON rooms.Id = "roomUsers"."roomId"
      WHERE "roomUsers"."userId" = $1`;
    const resp = await db.query(q, [userId]);
    if (!resp) return [];

    return resp.rows;
  },

  // createNew: async (msg) => {
  //   const q = `
  //     INSERT INTO messages ("userId", "roomId", body)
  //     VALUES ($1, $2, $3)
  //     RETURNING *`;
  //   const resp = await db.query(q, [msg.userId, msg.roomId, msg.body]);
  //   if (!resp) return false;

  //   return resp.rows[0];
  // },
};

module.exports = rooms;
