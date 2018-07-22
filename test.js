const db = require('./sql/db');
const Game = require('./game/Game');
const Tower = require('./game/pawns/Tower');
module.exports = () => {

  const startingBoard = [
    ['A1', 'Tower', 0],  //0
    ['B1', 'Horse', 0]   //1 
    ['C1', 'Jack', 0],   //2
    ['D1', 'Queen', 0],  //3  
    ['E1', 'King', 0],   //4
    ['F1', 'Jack', 0],   //5
    ['G1', 'Horse', 0],  //6  
    ['H1', 'Tower', 0],  //7  
    ['A2', 'Little', 0], //8  
    ['B2', 'Little', 0], //9  
    ['C2', 'Little', 0], //10  
    ['D2', 'Little', 0], //11 
    ['E2', 'Little', 0], //12 
    ['F2', 'Little', 0], //13 
    ['G2', 'Little', 0], //14 
    ['H2', 'Little', 0], //15 
    ['A8', 'Tower', 1],  //16 
    ['B8', 'Horse', 1],  //17 
    ['C8', 'Jack', 1],   //18
    ['D8', 'Queen', 1],   //19
    ['E8', 'King', 1],  //20 
    ['F8', 'Jack', 1],   //21 
    ['G8', 'Horse', 1],  //22  
    ['H8', 'Tower', 1],  //23  
    ['A7', 'Little', 1], //24  
    ['B7', 'Little', 1], //25  
    ['C7', 'Little', 1], //26  
    ['D7', 'Little', 1], //27  
    ['E7', 'Little', 1], //28  
    ['F7', 'Little', 1], //29  
    ['G7', 'Little', 1], //30  
    ['H7', 'Little', 1]  //31
  ];

  console.log('TEST PAGE');
  const id = 1;
  const getGame = db.prepare('SELECT * FROM games WHERE id = :id;').get({id});
  //console.log(getGame);

  fastestGame = [
    [0,'F2', 'F4'],
    [1, 'E7', 'E6'],
    [0, 'G2', 'G4'],
    [1, 'D8', 'H4']
  ];

  const game = new Game();
  game.init(id);
  const save = game.save();

  const game2 = new Game();
  game2.restore(id);

  console.log(game2);
  
  
  for(let i = 0; i < fastestGame.length; i++){
    const indexofpawn = game.findIndexWithPosition(fastestGame[i][0], fastestGame[i][1]);
    game2.move(indexofpawn, fastestGame[i][2]);
  }

  game2.save();
  //game2.move(1, 'A3');
  
  /* const initialState = {
    position: 'A2',
    playerId: 1,
    hasMove: false
  };
  const tower = new Tower(initialState);
  tower.setPotentialsMovements();
  console.log(tower);
  tower.setPotentialsMovements();
   */
  

  
  
};