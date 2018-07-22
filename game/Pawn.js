class Pawns {
  constructor(initialState) {
    this.alive = initialState.alive;
    this.playerId = initialState.playerId;

    if (this.alive) {
      this.position = initialState.position;
      this.hasMove = initialState.hasMove;
    }
  }

  setDirections() {
    return this.directions;
  }

  setPotentialsMovements(OccupiedPositions) {
    if (!this.alive) return true;

    /* Setting potentiels as a hash cause I feel we'll have to check for value a lot more than iterate at least */
    this.potentials = {};
    const adversaryId = this.playerId === 0 ? 1 : 0;

    const maxIndex = 8; //Cause a board is 8*8
    const directions = this.setDirections();

    /* x and y could be handle in a single object [x,y] but it's easier to develop like that and will only save 4 lines */
    const xy = this.getXandY();
    const x = xy[0];
    const y = xy[1];

    for (let coord of directions) {
      for (let i = 0; i < coord.max; i++) {
        //We need to update new potential current position BUT still be able to reverse to original x,y when breaking the loop
        var tempX = i === 0 ? x : tempX;
        var tempY = i === 0 ? y : tempY;

        const newX = tempX + coord.x;
        const newY = tempY + coord.y;

        /* Here I need to check that new position is in the board 
        AND 
        that new position isn't occupied with a piece of mine. And for that I need the boardState...
          OR I could just pass occupied position of mine
          BUT I'll the whole boardGame for King potentials - or will I ?
         */
        const newPosition = this.getCoordinates(newX, newY);
        if (
          this.positionInBoard(newX, newY) &&
          !OccupiedPositions[this.playerId][newPosition]
        ) {
          
          /* This could be delocated to a function so we can overide it based on this.type instead of if / else */
          if (this.type === 'Little') {
            if (coord.attack && OccupiedPositions[adversaryId][newPosition]) {
              this.potentials[newPosition] = true;
              tempX = newX;
              tempY = newY;

            } else if (!coord.attack && !OccupiedPositions[adversaryId][newPosition]) {
              this.potentials[newPosition] = true;
              tempX = newX;
              tempY = newY;
            }
          } else {
            this.potentials[newPosition] = true;
            tempX = newX;
            tempY = newY;
          }
        } else break; //We're out of the board, no need to go further
      }
    }

    return true;
  }

  positionInBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  getXandY() {
    const x = parseInt(this.position.slice(0, 1), 36) - 10;
    const y = parseInt(this.position.slice(1, 2), 10) - 1;
    return [x, y];
  }

  getCoordinates(x, y) {
    return (10 + x).toString(36).toUpperCase() + (y + 1);
  }

  move(to) {
    this.position = to;
    this.hasMove = true;
  }

  die() {
    /* While I figure a way to only send back updates, this will at least lighten with time */
    this.alive = false;
    delete this.position;
    delete this.hasMove;
    delete this.directions;
    delete this.potentials;
  }
}

module.exports = Pawns;
