import { Position } from './Position.js';

export class Piece {

    constructor(xPos, yPos, side, id, stack) {

        this.id = id;
        this.positon = new Position(xPos, yPos, side);
        this.side = side;

        if(stack != null)
            this.stack = stack;
        else
            this.stack = 1;
    }

    getPosition() {
        return this.positon;
    }

    setPosition(xPos, yPos) {
        this.positon = new Position(xPos, yPos, null);
    }

    incrementStack() {
        this.stack = 2;
    }
}