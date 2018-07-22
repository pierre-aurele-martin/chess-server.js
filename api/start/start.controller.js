const db = require('../../sql/db');
const start = (req, res) => {
  const name = req.body.name;
  if (!name)
    return res
      .status(401)
      .json({ error: true, msg: 'Please provide a name to play :)' });

  const date = new Date();
  const created = date.toISOString();

  try {
    const newGame = db
      .prepare(
        'INSERT INTO games (player_1_name, created) VALUES (:name, :created);'
      )
      .run({ name, created });

    res.json({ id: newGame.lastInsertROWID, name });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Error while creating a new game !' });
  }
};

module.exports.start = start;
