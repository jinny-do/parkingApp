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

console.log("DB 연결 시도: ", process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);
conn.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
    } else {
        console.log('MySQL 연결 성공!');
    }
});