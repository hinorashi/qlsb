const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../../db/qlsb.db'), (err) => {
    if (err) console.error('Failed to connect to database:', err.message);
    else {
        console.log('✅ SQLite DB connected!');
        // List all tables in the database
        db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", (err, rows) => {
            if (err) {
                console.error('Error fetching tables:', err.message);
            } else {
                console.log('Tables in database:');
                rows.forEach(row => console.log(' -', row.name));
            }
        });
    }
});

module.exports = db;
