const debug = require('debug')('server:db');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'nilsonmolina',
  password: '',
  database: 'chapp',
});

module.exports = {
  query: (text, params) => {
    const start = Date.now();
    return pool.query(text, params)
      .then((res) => {
        debug(`${text.replace(/\s\s+/g, ' ')} - ${Date.now() - start}ms - rows: ${res.rowCount}`);
        return res;
      }).catch(err => debug(`Error: ${err}`));
  },
};
