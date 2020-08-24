export class Position {

    constructor(xPos, yPos, empty) {
        this.xPos = xPos;
        this.yPos = yPos;

        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.neighbors = [];

        this.previous = undefined;

        this.wall = true;

        if(empty == 'E')
            this.isEmpty = true;
        else
            this.isEmpty = false;
    }

    addNeighbors(board) {

        let i = this.xPos;
        let j = this.yPos;

        if(i > 0 && j > 0) {
            this.neighbors.push(board[i - 1][j - 1]);
        }

        if(i < 7 && j > 0) {
            this.neighbors.push(board[i + 1][j - 1]);
        }

        if(i > 0 && j < 7) {
            this.neighbors.push(board[i - 1][j + 1]);
        }

        if(i < 7 && j < 7) {
            this.neighbors.push(board[i + 1][j + 1]);
        }
    }
}