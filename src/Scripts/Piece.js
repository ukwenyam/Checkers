import { Position } from './Position.js';

export class Piece {

    constructor(xPos, yPos, side, id) {

        this.id = id;
        this.positon = new Position(xPos, yPos, side);
        this.side = side;
        this.stack = 1;
    }

    getPosition() {
        return this.positon;
    }

    setPosition(xPos, yPos) {
        this.positon = new Position(xPos, yPos, null);
    }

    incrementStack() {
        this.stack++;
    }
}