const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// Convert MySQL-style "?" placeholders into Postgres "$1, $2, ..." placeholders
// so the route code can stay database-agnostic.
function toPgPlaceholders(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// Wrapper that mirrors the mysql2 API used across the routes:
//   const [rows] = await db.query(sql, params);
// Returns [rows, fullResult] so existing destructuring keeps working.
module.exports = {
  query: async (sql, params = []) => {
    const res = await pool.query(toPgPlaceholders(sql), params);
    return [res.rows, res];
  },
  pool,
};
