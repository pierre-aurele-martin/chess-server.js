const Pawns = require('../Pawn');

class Jack extends Pawns {
  constructor(initialState) {
    super(initialState);
    this.type = 'Jack';

    if (this.alive) {
      this.directions = [
        { x: 1, y: 1, max: 7 },
        { x: 1, y: -1, max: 7 },
        { x: -1, y: -1, max: 7 },
        { x: -1, y: 1, max: 7 },
      ];
    }
  }
}

module.exports = Jack;
