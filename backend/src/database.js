const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../../db/qlsb.db'), (err) => {
    if (err) console.error('Failed to connect to database:', err.message);
    else console.log('✅ SQLite DB connected!');
});

module.exports = db;
