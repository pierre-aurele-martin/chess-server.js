const db = require('./db');

const createTables = () => {
  /* TODO : add indices CREATE UNIQUE INDEX idx_contacts_email ON contacts (email); */
  try {
    const createParties = db
      .prepare(
        `
  CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY NOT NULL,
  player_1_id INTEGER NOT NULL DEFAULT 0,
  player_1_name VARCHAR(255) NOT NULL,
  player_2_id INTEGER NOT NULL DEFAULT 1,
  player_2_name VARCHAR(255),
  status BOOLEAN DEFAULT 1,
  created TEXT,
  updated TEXT
  );`
      )
      .run();

    const createMoves = db
      .prepare(
        `
  CREATE TABLE IF NOT EXISTS moves (
  id INTEGER PRIMARY KEY NOT NULL,
  game_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  initial_positon CHARACTER(2),
  to_position CHARACTER(2),
  current BOOLEAN NOT NULL DEFAULT 1,
  created TEXT,
  updated TEXT,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (player_id, player_id) REFERENCES games(player_1_id, player_2_id)
  );`
      )
      .run();

    const createBoards = db
      .prepare(
        `
  CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY NOT NULL,
  game_id INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT 1,
  state BLOB,
  created TEXT,
  FOREIGN KEY (game_id) REFERENCES games(id)
  );`
      )
      .run();
  } catch (error) {
    throw new Error('Error while creating the tables ==> ' + error);
  }
};

module.exports = createTables;
