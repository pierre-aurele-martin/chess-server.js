const db = require('../../sql/db');
const Game = require('../../game/Game');

const get = (req, res) => {
  /* get ID then fetch boards.state then youre good to go */
  const partyId = parseInt(req.params.id);
  if (partyId < 1) res.status(400);

  try {
    const game = new Game();
    game.restore(partyId);
    res.json({ partyId, game });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const move = (req, res) => {
  /*  
    As I had plan to make a front-end, I'm a little fuck with the fact that my game.state is an Array and not a hash.
    It means that I have to for(O(n/2)) to get the pawn of a from position like 'A2'

    game.findIndex(position) => indexOfPawn;

    I'll add this function to make the API easier to use but bear in mind it not technically required :)
    Even if it's kind of mistake to mix two differents parameters type in the same function

    fastestGame = [ [0,'F2', 'F4'], [1, 'E7', 'E6'], [0, 'G2', 'G4'], [1, 'D8', 'H4']];
    So play a fast game : 
    Content-Type: application/x-www-form-urlencoded
    for(let i = 0; i < fastestGame.length; i++){
      game2.move(game.findIndexWithPosition(fastestGame[i][0], fastestGame[i][1]), fastestGame[i][2]);
    }

  */

  const partyId = parseInt(req.params.id);
  
  const playerName = req.body.playerName;
  const from = req.body.from;
  const to = req.body.to;

  if (partyId < 1 || from.length !== 2 || to.length !== 2) res.status(400);

  try {
    const game = new Game();
    game.restore(partyId);
    const playerId = game.getPlayerId(playerName);
    const indexOfFrom = game.findIndexWithPosition(playerId, from);
    game.move(indexOfFrom, to);
    game.save();
    res.json({ partyId, game });
  } catch (error) {
    console.error(error);
    /* Dont know why I can send into json this error...! */
    res.status(500).json({ error });
  }
  /* 
    First we get,
    then we create a game that we restore
    then we go for the move
  */
};

module.exports.get = get;
module.exports.move = move;
