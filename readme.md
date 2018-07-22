# chess-server.js

This is a simple API to play Chess. You can start a party, join it and make your pawns moves until the **checkmate** !

#### Disclaimer : 
This in work in progress made in a few hours hackathon. Some movements like roque, pawn mutations etc are not implemented yet. Most importantly, some simple check might be trigger as checkmate ! Again, work in progress :)

All code is commented, feel free to contribute / show me better solutions :)

[You can find a fully functional chess.js here](https://github.com/jhlywa/chess.js) . I've not use standards PGN nor FEN as I wanted to create everything from scratch (plus I don't know those :)

[Chess rules \[FR\]](https://fr.wikipedia.org/wiki/%C3%89checs#%C3%89checs_et_informatique)

## Install
Just clone this repo and run `npm install` !

### Dependencies 
[better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) to have a local database with ease.
[express](http://expressjs.com) to easily setup a server
[body-parser](https://www.npmjs.com/package/body-parser) to parse incoming body on request. 

## Run
Just run `npm start` with a valid `process.env.PORT` 
or `npm run dev` will launch you a [nodemon](https://github.com/remy/nodemon) on `:3000`

### Run a full game 

    POST /api/start?name=Pierrot
    POST /api/join?id=:id&name=Lucas
    POST /api/party/:id/move?playerName=Pierrot&from=F2&to=F4
    POST /api/party/:id/move?playerName=&from=E7&to=E6
    POST /api/party/:id/move?playerName=Pierrot&from=G2&to=G4
    POST /api/party/:id/move?playerName=&from=D8&to=H4
    
**Checkmate, Lucas win**

## Routes
### GET /api
I just use it to run a **Test** class and say hello :)

### POST /api/start
Take a `String:name` to start a party, the name will be Player 1.
Return your **name**, and the **partyId** so you can invite who you want: )

### POST /api/join
Take an `(Option) Int:id` and a `String:name` as parameters.
Return your **name**,  **partyId** and the **Game()** state !

If you're the first to "join", you will have everything but the new Game() of course.

### GET /api/party/:partyId
Take a `Int:partyId` as URI parameter and will return you the current **Game()** state of it.

### POST /api/party/:partyId/move
Take a `Int:partyId` as URI parameter and :
 - `String:playerName` :  you got it when you start or join ;
 - `String:from` : the position of the pawn you want to move on a format "A1", "C4 etc... ;
 - `String:to` : the position of the case you want to go on a format "A1", "C4 etc... ;

You'll have in return the updated **Game()** state.


## Game() properties :

    Game {
      id: Int: the partyID,
      active: Bool: is the game finish ?,
      mustDo: Array: forcedMove when state of Chess,
      players: Array: [ 'Player1', 'Player2' ],
      turnTo: Int: id of player with the hand,
      state:
       Array(32): [ Pawn Class {
       alive: Bool: is the pawn alive,
       playerId: Int: Who's player is this pawn,
       position: String: current pawn position ex: 'A1',
       hasMove: Boold: has this pawn moved ?,
       type: String: type of the pawn,
       directions: Array: vectors of movement,
       potentials: Object: allowed moves for this pawn },
       [...]
      ],
      occupied:
       [ 
	       Object: Player1 occupied positions ,
	       Object: Player2 occupied positions ,
      ],
      kingPositions: [ String: 'Player 1 king position', String: 'Player 2 king position' ],
      winner: Int:is there a winner ?  }

## Game() Methods :
Coming soon,  all files are commented and should be easy to understand.