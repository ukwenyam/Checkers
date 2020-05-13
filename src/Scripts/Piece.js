import { Position } from './Position.js';

export class Piece {

    constructor(xPos, yPos, side) {

        this.positon = new Position(xPos, yPos, side);
        this.side = side;
        this.stack = 1;
    }

    getPosition() {
        return this.positon;
    }

    setPosition(pos) {
        this.positon = pos;
    }

    incrementStack() {
        this.stack++;
    }
}