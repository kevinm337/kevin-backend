const { Pool } = require('pg');
require('dotenv').config();

console.log("Loaded DB_PORT =", process.env.DB_PORT);

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'kevin_blog',
  password: 'Messi123!@#',
  port: 5432,
});

module.exports = pool;
