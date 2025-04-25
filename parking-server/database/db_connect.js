//db_connect.js
//db연결 만듦

require('dotenv').config(); // ← 꼭 상단에!

const db = require('mysql2');

const conn = db.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = conn;
