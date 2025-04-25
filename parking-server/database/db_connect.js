//db_connect.js
//db연결 만듦

const db = require('mysql2');

const conn = db.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'parking_db',
});

module.exports = conn;
