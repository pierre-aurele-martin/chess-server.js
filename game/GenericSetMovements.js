const setPotentialsMovements = (that, OccupiedPositions) => {
  this = that;
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
        /* Here need to deal with the fact that Little pawn have special attacks move */
        if (this.type === 'Little') {
          if (coord.attack && OccupiedPositions[adversaryId][newPosition]) {
            this.potentials[newPosition] = true;
            tempX = newX;
            tempY = newY;
          } else if (
            !coord.attack &&
            !OccupiedPositions[adversaryId][newPosition]
          ) {
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

module.exports = setPotentialsMovements;