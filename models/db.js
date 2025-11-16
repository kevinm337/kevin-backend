// db.js
const { Pool } = require("pg");
require("dotenv").config();

// Pool configuration for Render PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,      // e.g. dpg-d4cqcu2li9vc73c5fj6g-a.oregon-postgres.render.com
  user: process.env.DB_USER,      // e.g. kevin_blog_db_user
  database: process.env.DB_NAME,  // e.g. kevin_blog_db
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false,    // needed for Render's self-signed cert
  },
});

// Optional: quick test on startup
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PG error", err);
});

module.exports = pool;
