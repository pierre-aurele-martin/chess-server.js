const Pawns = require('../Pawn');

class King extends Pawns {
  constructor(initialState) {
    super(initialState);
    this.type = 'King';

    if(this.alive) {
      this.directions = [
        { 'x': 0, 'y': 1, 'max': 1 },
        { 'x': 0, 'y': -1, 'max': 1 },
        { 'x': -1, 'y': 0, 'max': 1 },
        { 'x': 1, 'y': 0, 'max': 1 },
        { 'x': 1, 'y': 1, 'max': 1 },
        { 'x': 1, 'y': -1, 'max': 1 },
        { 'x': -1, 'y': -1, 'max': 1 },
        { 'x': -1, 'y': 1, 'max': 1 },
     ];
    }
  }
}

module.exports = King;
