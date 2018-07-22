const db = require('../../sql/db');
const Game = require('../../game/Game');

const join = (req, res) => {
  const name = req.body.name;
  const id = parseInt(req.body.game);

  if (!name)
    return res
      .status(401)
      .json({ error: true, msg: 'Please provide a name to play :)' });

  try {
    //Check the game exist and second slot is available
    const getGame = db
      .prepare('SELECT * FROM games WHERE id = :id;')
      .all({ id });

    const date = new Date();
    const updated = date.toISOString();
    if (getGame.length === 1) {
      //The game is joinable
      const joinGame = db
        .prepare(
          'UPDATE games SET player_2_name = :name, updated = :updated WHERE id = :id;'
        )
        .run({ name, updated, id });

      //Game is ready to rule - we initiate the board
      const game = new Game();
      game.init(id);
      game.save();

      res.json({ id, name, game});
    } else if (getGame.length === 0) {
      //The game is not joinable so we create a new one
      const newGame = db
        .prepare(
          'INSERT INTO games (player_1_name, created) VALUES (:name, :created);'
        )
        .run({ name, created: updated });

      res.json({ id: newGame.lastInsertROWID, name });
    } else {
      //This should never happen
      console.log(error);
      res.status(500).json({
        error: 'More than one party with this id. Please start a new one !'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error while joining the game !' });
  }
};

module.exports.join = join;
