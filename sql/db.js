const Database = require('better-sqlite3');
const db = new Database('./sql/chess.db', { memory: false });

module.exports = db;