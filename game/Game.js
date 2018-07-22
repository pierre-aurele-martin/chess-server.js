/*
 TODO : 
  finish the check function switch TODO

  Missing Rules - : 
    en passant (Update Little.js getPotential method ~ easy)
    50 moves (Game.js function ~ easy)
    roque (Update Tower.js getPotentnial method ~medium ? not sure)
    pat ( Game.js ~hard seems really specific )
    promotion (Game.js or Little.js ? Transform the pawn into user choice when on opposed line ~easy/medium cause API not ready)

  Rename Pawns with official name. Or nah.
*/
const db = require('../sql/db');

const Tower = require('./pawns/Tower');
const Horse = require('./pawns/Horse');
const Jack = require('./pawns/Jack');
const Queen = require('./pawns/Queen');
const King = require('./pawns/King');
const Little = require('./pawns/Little');

const classes = { Tower, Horse, Jack, Queen, King, Little };
function dynamicClass(name) {
  return classes[name];
}

class Game {
  init(id) {
    //We make sure we have two players for this game_id
    var getPlayers;
    try {
      getPlayers = db
        .prepare(
          'SELECT player_1_name , player_2_name FROM games WHERE id = :id AND player_2_name IS NOT NULL;'
        )
        .get({ id });
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error while trying to fetch your game in table games :-('
      );
    }

    if (!getPlayers) throw new Error('No players found. Please start a game.');

    const startingBoard = [
      ['A1', 'Tower', 0], //0
      ['B1', 'Horse', 0], //1
      ['C1', 'Jack', 0], //2
      ['D1', 'Queen', 0], //3
      ['E1', 'King', 0], //4
      ['F1', 'Jack', 0], //5
      ['G1', 'Horse', 0], //6
      ['H1', 'Tower', 0], //7
      ['A2', 'Little', 0], //8
      ['B2', 'Little', 0], //9
      ['C2', 'Little', 0], //10
      ['D2', 'Little', 0], //11
      ['E2', 'Little', 0], //12
      ['F2', 'Little', 0], //13
      ['G2', 'Little', 0], //14
      ['H2', 'Little', 0], //15
      ['A8', 'Tower', 1], //16
      ['B8', 'Horse', 1], //17
      ['C8', 'Jack', 1], //18
      ['D8', 'Queen', 1], //19
      ['E8', 'King', 1], //20
      ['F8', 'Jack', 1], //21
      ['G8', 'Horse', 1], //22
      ['H8', 'Tower', 1], //23
      ['A7', 'Little', 1], //24
      ['B7', 'Little', 1], //25
      ['C7', 'Little', 1], //26
      ['D7', 'Little', 1], //27
      ['E7', 'Little', 1], //28
      ['F7', 'Little', 1], //29
      ['G7', 'Little', 1], //30
      ['H7', 'Little', 1] //31
    ];

    this.id = id;
    this.active = true;
    this.mustDo = [[], []];
    this.turnTo = 0;

    //player 1 is white (index0), player 2 is black (index1)
    this.players = [getPlayers.player_1_name, getPlayers.player_2_name];

    this.generateBoard(startingBoard);
  }

  restore(id) {
    try {
      const getGame = db
        .prepare('SELECT state FROM boards WHERE game_id = :id;')
        .get({ id: id });

      const game = JSON.parse(getGame.state);

      if (game.state.length !== 32)
        throw new Error('An error occured while restoring your game.');

      this.id = game.id;
      this.active = game.active;
      this.mustDo = game.mustDo;
      //player 1 is white (index0), player 2 is black (index1)
      this.players = game.players;
      this.turnTo = game.turnTo;

      this.generateBoard(game.state, true);

      return;
    } catch (error) {
      console.error(error);
      throw new Error('Error while trying to save the game :-(');
    }
  }

  generateBoard(state, restore = false) {
    //We generate the board State by creating all pawns
    /* Should this be hard coded ? Not sure about efficiency... */
    /* I store occupied position as Hash so I O(1) instead of O(n) when checking of position is available */
    this.state = [];
    this.occupied = [{}, {}];
    this.kingPositions = [];

    for (let i of state) {
      let Pawn, position, playerId, initialState;

      if (!restore) {
        Pawn = dynamicClass(i[1]);
        position = i[0];
        playerId = i[2];
        initialState = {
          position,
          playerId,
          hasMove: false,
          alive: true
        };
      } else {
        Pawn = dynamicClass(i.type);
        position = i.position;
        playerId = i.playerId;
        initialState = {
          position,
          playerId,
          hasMove: i.hasMove,
          alive: i.alive
        };
      }

      this.occupied[playerId][position] = true;

      const pawn = new Pawn(initialState);
      this.state.push(pawn);

      if (pawn.type === 'King') {
        this.kingPositions[playerId] = pawn.position;
      }
    }

    /* Now that we have the this.state, we can loop it to get potentiels movements */
    //We can't use for(pawn of this.state) as it seem to destroy Class method
    for (let i = 0; i < state.length; i++) {
      this.state[i].setPotentialsMovements(this.occupied);
    }
  }

  updateOccupied(playerId, from, to = false) {
    delete this.occupied[playerId][from];
    if (to) this.occupied[playerId][to] = true;
    return true;
  }

  move(pawnIndex, to) {
    //Check that to is in potential
    //Check if there is
    const pawn = this.state[pawnIndex];
    const playerId = pawn.playerId;
    const advId = playerId === 0 ? 1 : 0;
    const advKingPosition = this.kingPositions[advId];
    const from = pawn.position;

    if (this.turnTo !== playerId)
      throw new Error('Not your turn, lil cheater !');
    if (!pawn.potentials[to]) throw new Error('Illegal move');

    if (
      this.mustDo[playerId].length &&
      !this.mustDo[playerId].includes(pawn.position + ':' + to)
    )
      throw new Error('You must deal with your Check status');

    //We update the pawn position && get new potentials
    pawn.move(to);
    this.updateOccupied(playerId, from, to);
    this.recalculatePotentials(playerId);

    //I need to recalcultate my adversary potentials too as it's dependent of my own pawns position
    /* Exemple as reminder, a tower might have been block by a little and now have free way */
    this.recalculatePotentials(advId)

    if (pawn.type === 'King') this.kingPositions[playerId] = pawn.position;
    //We update the game state
    this.state[pawnIndex] = pawn;

    //We also need to check if an adversary pawn was on the new position and if it's the king then we don't just delete it
    if (this.occupied[advId][to] && advKingPosition !== to) {
      /* This is not efficient but would imply have dynamic unique key for state based on pawn[type, playerId, position]
      so I'm not sure that would be better AND simpler  */
      /* Reducing complexity by two */
      const initI = playerId < 1 ? 0 : 16;
      const maxI = playerId < 1 ? 16 : 32;
      for (let i = initI; i < maxI; i++) {
        const attackedPawn = this.state[i];
        if (attackedPawn.playerId === advId && attackedPawn.position === to) {
          this.updateOccupied(advId, attackedPawn.position);
          attackedPawn.die();
          break;
        }
      }
    }

    /* TODO : Save the move in db for rewind options */
    if (pawn.potentials[advKingPosition]) {
      //Check
      this.check(pawnIndex);
    }

    /* When move is over, we switch turn */
    this.turnTo = advId;
  }

  check(attackingPawnIndex) {

    const attackingPawn = this.state[attackingPawnIndex];
    const playerId = attackingPawn.playerId;
    const advId = playerId === 0 ? 1 : 0;
    var sorted;
    if (playerId > 0) {
      sorted = this.state.sort((a, b) => {
        if (a.playerId < b.playerId) return 1;
        else return -1;
      });
    }

    /* Here I should not use a hash as it prevents me to get if one position can be attack by two pawns */
    var playerPotentials = {};
    const adversaryMustdo = [];
    /* Reducing complexity by two - I need to start by my Pawns to get all Potential positions */
    for (let i = 0; i < 16; i++) {
      const pawn = playerId > 0 ? sorted[i] : this.state[i];
      if (pawn.type !== 'King') {
        //I don't think the King can attack the other King...
        playerPotentials = Object.assign(playerPotentials, pawn.potentials);
      }
    }

    /* Now I'll loop through my opponents potentiels - that are already recalculate - to see if he can do something */
    /* 
     Three ways to escape :
      - move the king: recalculate advKing potentials movement and make sure they are not in any other potentials I have
      - destroy my piece: does adv Pawns have my new position in potential ?
      - move an other piece in the way : only if check was made with Queen, Tower or Jack ???
    */
    for (let i = 0; i < 16; i++) {
      const pawn = advId > 0 ? sorted[i] : this.state[i];
      switch (pawn.type) {
        case 'King':
          for (let option in pawn.potentials) {
            //Then he can move his king here
            if (!playerPotentials[option])
              adversaryMustdo.push(pawn.position + ':' + option);
          }
          break;
        case 'Queen':
        case 'Tower':
        case 'Horse':
        /* TODO : I need to know the attacking pawn here !
         How to calculate if one of his pawns could get in the way of the attacking pawn and the King ?
       */
        default:
          /* Can one of the advPawns take this or another  pawn that is threating the King ? */
          for (let option in pawn.potentials) {
            //Then I can kill the threat
            if (option === attackingPawn.position) {
              adversaryMustdo.push(pawn.position + ':' + option);
            }
          }
          /* TODO : How could I efficienly calculate if killing any other pawn would free a slot for the King ? */
          break;
      }  
    }

    if (adversaryMustdo.length === 0) {
      this.checkMate(playerId);
    } else {
      this.mustDo[advId] =adversaryMustdo;
    }
  }

  checkMate(winner) {
    this.active = false;
    this.turnTo = false;
    this.winner = winner;
    console.log('CHECK MATE !');
  }

  recalculatePotentials(playerId) {    
    for (let i = playerId < 1 ? 0 : 16; i < (playerId < 1 ? 16 : 32); i++) {
      const pawn = this.state[i];
      pawn.setPotentialsMovements(this.occupied);
    }
  }

  save() {
    const date = new Date();
    const created = date.toISOString();

    /* Table.boards params are 100% duplicate with this.state and not really unecessary - just a bit */
    const params = {
      id: this.id,
      active: this.active ? 1 : 0,
      state: JSON.stringify(this),
      created
    };

    try {
      /* 
        For when I have time, sqllite INSERT IF NOT EXIST : 
        INSERT OR REPLACE INTO Employee (id, name, role) VALUES (  1, 'Susan Bar',
          COALESCE((SELECT role FROM Employee WHERE id = 1), 'Benchwarmer')
        );
      */
      const deletePrevious = db
        .prepare('DELETE FROM boards WHERE id = :id')
        .run({ id: this.id });

      const save = db
        .prepare(
          'INSERT INTO boards (game_id, active, state, created) VALUES (:id, :active, :state, :created);'
        )
        .run(params);

      /* With returning the whole object here, we avoid to call this.getJson() two times in a row when we want to save */
      return params;
    } catch (error) {
      console.error(error);
      throw new Error('Error while trying to save the game :-(');
    }
  }

  findIndexWithPosition(playerId, position){
    
    for (let i = playerId < 1 ? 0 : 16; i < (playerId < 1 ? 16 : 32); i++) {
      const pawn = this.state[i];
      if(position === pawn.position) return i;
    }
    throw new Error('The position from in input doesnt match any pawns.');
  }

  getPlayerId(playerName) {
    for(let i = 0; i < 2; i++){
      if(this.players[i] === playerName) return i;
    }

    throw new Error('Please make sure your name is in this game !');
  }
}

module.exports = Game;
