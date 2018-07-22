const Pawns = require('../Pawn');

class Horse extends Pawns {
  constructor(initialState) {
    super(initialState);
    this.type = 'Horse';

    if (this.alive) {
      this.directions = [
        { x: 1, y: 2, max: 1 },
        { x: 2, y: 1, max: 1 },
        { x: 2, y: -1, max: 1 },
        { x: 1, y: -2, max: 1 },
        { x: -1, y: -2, max: 1 },
        { x: -2, y: -1, max: 1 },
        { x: -2, y: 1, max: 1 },
        { x: -1, y: 2, max: 1 }
      ];
    }
  }
}

module.exports = Horse;
