const Pawns = require('../Pawn');

class Little extends Pawns {
  constructor(initialState) {
    super(initialState);
    this.type = 'Little';

    if(this.alive){
      this.directions = [
        [
          { x: 0, y: 1, max: 1 },
          { x: 1, y: 1, max: 1, attack: true },
          { x: -1, y: 1, max: 1, attack: true }
        ],
        [
          { x: 0, y: -1, max: 1 },
          { x: -1, y: -1, max: 1, attack: true },
          { x: 1, y: -1, max: 1, attack: true },
        ]
      ];
      this.startDirections = [
        [{ x: 0, y: 2, max: 1 }],
        [{ x: 0, y: -2, max: 1 }]
      ];
    }
  }

  /* Little pawn has a specific way of moving so we erase super method*/
  setDirections() {
    var directions = {};
    const id = this.playerId;

    directions = !this.hasMove ? this.directions[id].concat(this.startDirections[id]) : this.directions[id];
    return directions;
  }
}

module.exports = Little;
