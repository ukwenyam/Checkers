import { Piece } from './Piece.js';
import { Position } from './Position.js';

export class Board {

    constructor(state) {

        if(!arguments.length) {

            this.board = [];

            let i, j, k = 0;

            for(i = 0; i < 8; i++) {

                this.board[i] = [];
            
                for(j = 0; j < 8; j++) {
            
                    let even = (i % 2 == 0) && (j % 2 == 0);
                    let odd = (i % 2 != 0) && (j % 2 != 0);
            
                    if(even || odd || i == 3 || i == 4) {
                    
                        this.board[i][j] = null;

                    } else  {

                        if(0 <= i && i <= 2)
                            this.board[i][j] = new Piece(i, j, 'U', k, null);
                            
                        else 
                            this.board[i][j] = new Piece(i, j, 'D', k, null);

                        k++;
                    }
                }
            }
        } else {

            this.board = state;
        }
    }


    takePiece(piece, currPos, yDiff, nextPos) {

        let isTaken = false;
/*
        if(piece.side == 'U' && piece.stack == 1) {

            let xPiece = currPos.xPos + 1;
            let yPiece = null;

            if(yDiff < 0)
                yPiece = currPos.yPos - 1;
            if(yDiff > 0)
                yPiece = currPos.yPos + 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                this.board[xPiece][yPiece] = null;
                isTaken = true;
            }
        }

        if(piece.side == 'D' && piece.stack == 1) {

            let xPiece = currPos.xPos - 1;
            let yPiece = null;

            if(yDiff < 0)
                yPiece = currPos.yPos + 1;
            if(yDiff > 0)
                yPiece = currPos.yPos - 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                this.board[xPiece][yPiece] = null;
                isTaken = true;
            }
        }

        if(piece.stack > 1) {
*/
            let xPiece = null;
            let yPiece = null;

            if(nextPos.xPos < currPos.xPos && nextPos.yPos < currPos.yPos) {

                xPiece = currPos.xPos - 1;
                yPiece = currPos.yPos - 1;

                if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                    this.board[xPiece][yPiece] = null;
                    isTaken = true;
                }
            }

            if(nextPos.xPos < currPos.xPos && nextPos.yPos > currPos.yPos) {

                xPiece = currPos.xPos - 1;
                yPiece = currPos.yPos + 1;

                if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                    this.board[xPiece][yPiece] = null;
                    isTaken = true;
                }
            }

            if(nextPos.xPos > currPos.xPos && nextPos.yPos < currPos.yPos) {

                xPiece = currPos.xPos + 1;
                yPiece = currPos.yPos - 1;

                if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                    this.board[xPiece][yPiece] = null;
                    isTaken = true;
                }
            }

            if(nextPos.xPos > currPos.xPos && nextPos.yPos > currPos.yPos) {

                xPiece = currPos.xPos + 1;
                yPiece = currPos.yPos + 1;

                if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                    this.board[xPiece][yPiece] = null;
                    isTaken = true;
                }
            }
        //}

        return isTaken;
    }


    isMoveLegal(piece, nextPos) {

        let legal = false;

        let currPos = piece.getPosition();

        if(piece.side == 'U' && nextPos.isEmpty) {

            let xDiff = nextPos.xPos - currPos.xPos;

            let yDiff = nextPos.yPos - currPos.yPos;

            if(piece.stack == 1) {

                let oneSq = (yDiff == 1 || yDiff == -1) && xDiff == 1;

                let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                if(oneSq)
                    legal = true;

                if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                    legal = true;
                }

            } else {

                let oneSq = (xDiff == 1 || xDiff == -1) && (yDiff == 1 || yDiff == -1);

                let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                if(oneSq)
                    legal = true;

                if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                    legal = true;
                }
            }
        }

        if(piece.side == 'D' && nextPos.isEmpty) {

            //console.log(currPos.xPos + ", " + currPos.yPos + " --> " + nextPos.xPos + ", " + nextPos.yPos);

            let xDiff = currPos.xPos - nextPos.xPos;

            let yDiff = currPos.yPos - nextPos.yPos;

            if(piece.stack == 1) {

                //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

                let oneSq = (yDiff == 1 || yDiff == -1) && xDiff == 1;

                //console.log(oneSq);

                let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                if(oneSq) {
                    //console.log(nextPos.xPos + ", " + nextPos.yPos);
                    legal = true;
                }

                if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) 
                    legal = true;

            } else {

                let oneSq = (xDiff == 1 || xDiff == -1) && (yDiff == 1 || yDiff == -1);

                let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                if(oneSq)
                    legal = true;

                if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) 
                    legal = true;
            }
        }

        return legal;
    }


    doMove(piece, nextPos) {

        let moved = false;

        if(this.isMoveLegal(piece, nextPos)) {

            this.scanBoard(piece, nextPos);

            let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

            if(nextPos.xPos == 0 && newPiece.side == "D" && newPiece.stack == 1) 
                newPiece.incrementStack();

            if(nextPos.xPos == 7 && newPiece.side == "U" && newPiece.stack == 1) 
                newPiece.incrementStack();

            this.board[nextPos.xPos][nextPos.yPos] = newPiece;
            
            let currPos = piece.getPosition(); 

            this.board[currPos.xPos][currPos.yPos] = null;

            moved = true;
        }

        return moved;
    } 

    scanBoard(piece, nextPos) {

        let i, j;

        for(i = 0; i < 8; i++) {
            for(j = 0; j < 8; j++) {
                if(this.board[i][j] != null && this.board[i][j].id != piece.id && this.board[i][j].side == piece.side) {
                    if(this.checkPiece(this.board[i][j], piece, nextPos)) {
                        break;
                    }
                }
            }
        }
    }


    checkPiece(currPiece, piece, nextPos) {

        //console.log(currPiece.id);

        let autoRemove = false;

        let xNext = nextPos.xPos;
        let yNext = nextPos.yPos;

        let xPos = currPiece.getPosition().xPos;
        let yPos = currPiece.getPosition().yPos;

        if(0 <= xPos - 2 && 0 <= yPos - 2 && xPos - 2 <= 7 && yPos - 2 <= 7) {
            //console.log("Upper Left");
            if(this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side && this.board[xPos - 2][yPos - 2] == null) {
                this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Upper Left");
            }
        }

        if(0 <= xPos + 2 && 0 <= yPos + 2 && xPos + 2 <= 7 && yPos + 2 <= 7) {
            //console.log("Lower Right");
            if(autoRemove == false && this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Lower Right");
            }
        }

        if(0 <= xPos - 2 && 0 <= yPos + 2 && xPos - 2 <= 7 && yPos + 2 <= 7) {
            //console.log("Upper Right");
            if(autoRemove == false && this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Upper Right");
            }
        }

        if(0 <= xPos + 2 && 0 <= yPos - 2 && xPos + 2 <= 7 && yPos - 2 <= 7) {
            //console.log("Lower Left");
            if(autoRemove == false && this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Lower Left");
            }
        }

        return autoRemove;
    }


    isEmpty(xpos, ypos) {

        if(this.board[xpos][ypos] != null)
            return false;
        else
            return true;
    }

    getId(i, j) {
        return this.board[i][j].id;
    }

    getSide(i, j) {

        return this.board[i][j].side;
    }

    getPiece(i, j) {
        
        if(this.board[i][j] != null)
            return this.board[i][j];

    }

    getBoard() {
        return this.board;
    }

}