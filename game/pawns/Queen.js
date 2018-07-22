const Pawns = require('../Pawn');

class Queen extends Pawns {
  constructor(initialState) {
    super(initialState);
    this.type = 'Queen';

    if (this.alive) {
      this.directions = [
        { x: 0, y: 1, max: 7 },
        { x: 0, y: -1, max: 7 },
        { x: -1, y: 0, max: 7 },
        { x: 1, y: 0, max: 7 },
        { x: 1, y: 1, max: 7 },
        { x: 1, y: -1, max: 7 },
        { x: -1, y: -1, max: 7 },
        { x: -1, y: 1, max: 7 },
      ];
    }
  }
}

module.exports = Queen;
