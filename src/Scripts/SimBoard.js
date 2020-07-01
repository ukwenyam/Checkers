import { Piece } from './Piece.js';
import { Position } from '../Scripts/Position.js';
import { currUser, gamePref } from './Init.js';

export class SimBoard {

    constructor(state) {

        //console.log(state);

        this.myColor = null;
        this.otherColor = null;

        currUser.update(state => {
            if(state != null) {
                this.myColor = state.gamePref.myColor;
                this.otherColor = state.gamePref.otherColor;
            } else {
                this.myColor = "#ffffff";
                this.otherColor = "#000000";
            }
            return state;
        });

        this.board = [];
        this.myCheckers = [];
        this.otherCheckers = [];

        let i, j;

        for(i = 0; i < 8; i++) {

            this.board[i] = [];

            for(j = 0; j < 8; j++) {

                if(state[i][j] != null) {

                    this.board[i][j] = new Piece(i, j, state[i][j].side, state[i][j].id, state[i][j].stack);
                
                    if(state[i][j].side == this.myColor)
                        this.myCheckers.push(state[i][j].id);

                    if(state[i][j].side == this.otherColor)
                        this.otherCheckers.push(state[i][j].id);

                } else {
                    this.board[i][j] = null;
                }
            }
        }
    }

    takePiece(piece, nextPos) {

        let isTaken = false, currPos = piece.getPosition();

        let xPiece, yPiece;

        if(nextPos.xPos < currPos.xPos && nextPos.yPos < currPos.yPos) {

            xPiece = currPos.xPos - 1;
            yPiece = currPos.yPos - 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                isTaken = true;
            }
        }

        if(nextPos.xPos < currPos.xPos && nextPos.yPos > currPos.yPos) {

            xPiece = currPos.xPos - 1;
            yPiece = currPos.yPos + 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                isTaken = true;
            }
        }

        if(nextPos.xPos > currPos.xPos && nextPos.yPos < currPos.yPos) {

            xPiece = currPos.xPos + 1;
            yPiece = currPos.yPos - 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                isTaken = true;
            }
        }

        if(nextPos.xPos > currPos.xPos && nextPos.yPos > currPos.yPos) {

            xPiece = currPos.xPos + 1;
            yPiece = currPos.yPos + 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                isTaken = true;
            }
        }

        if(isTaken) {

            let myIndex = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
            let oppIndex = this.otherCheckers.indexOf(this.board[xPiece][yPiece].id)

            if(oppIndex != -1) 
                this.otherCheckers.splice(oppIndex, 1);

            if(myIndex != -1) 
                this.myCheckers.splice(myIndex, 1);
                
            this.board[xPiece][yPiece] = null;
        }
    }
    

    possibleMoves(piece) {

        let moves = [];
        let move;

        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        if(this.checkUpperLeft(xPos, yPos).oneSq) {
            if(this.board[xPos - 1][yPos - 1] == null) { 
                if(piece.side == this.myColor || (piece.side == this.otherColor && piece.stack > 1)) {
                    move = {
                        x: xPos - 1,
                        y: yPos - 1 
                    }
                    moves.push(move);
                }
            }
        }

        if(this.checkUpperLeft(xPos, yPos).twoSq) {
            if(this.board[xPos - 2][yPos - 2] == null && this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side) {
                move = {
                    x: xPos - 2,
                    y: yPos - 2 
                }
                moves.push(move);
            }
        }

        if(this.checkUpperRight(xPos, yPos).oneSq) {
            if(this.board[xPos - 1][yPos + 1] == null) {
                if(piece.side == this.myColor || (piece.side == this.otherColor && piece.stack > 1)) {
                    move = {
                        x: xPos - 1,
                        y: yPos + 1 
                    }
                    moves.push(move);
                }
            }
        }

        if(this.checkUpperRight(xPos, yPos).twoSq) {
            if(this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                move = {
                    x: xPos - 2,
                    y: yPos + 2 
                }
                moves.push(move);
            }
        }

        if(this.checkLowerLeft(xPos, yPos).oneSq) {
            if(this.board[xPos + 1][yPos - 1] == null) {
                if(piece.side == this.otherColor || (piece.side == this.myColor && piece.stack > 1)) {
                    move = {
                        x: xPos + 1,
                        y: yPos - 1 
                    }
                    moves.push(move);
                }
            } 
        }

        if(this.checkLowerLeft(xPos, yPos).twoSq) {
            if(this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                move = {
                    x: xPos + 2,
                    y: yPos - 2 
                }
                moves.push(move);
            }
        }

        if(this.checkLowerRight(xPos, yPos).oneSq) {
            if(this.board[xPos + 1][yPos + 1] == null) {
                if(piece.side == this.otherColor || (piece.side == this.myColor && piece.stack > 1)) {
                    move = {
                        x: xPos + 1,
                        y: yPos + 1 
                    }
                    moves.push(move);
                }
            } 
        }

        if(this.checkLowerRight(xPos, yPos).twoSq) {
            if(this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                move = {
                    x: xPos + 2,
                    y: yPos + 2 
                }
                moves.push(move);
            }
        }

        return moves;
    }


    isMoveLegal(piece, nextPos) {

        let legal = false, possMoves = [];

        possMoves = this.possibleMoves(piece);

        if(possMoves.length > 0) {

            for(let i = 0; i < possMoves.length; i++) {

                let xPos = possMoves[i].x;
                let yPos = possMoves[i].y;

                if(xPos == nextPos.xPos && yPos == nextPos.yPos) {

                    let xDiff = nextPos.xPos - xPos;
                    let yDiff = nextPos.yPos - yPos;

                    if((xDiff > -1 && yDiff > -1) || (xDiff > 1 && yDiff > 1) || (xDiff > -1 && yDiff > 1) || (xDiff > 1 && yDiff > -1))
                        this.takePiece(piece, nextPos);

                    legal = true;
                    break;
                }
            }
        }

        return legal;
    }

    allMovablePieces(side) {

        let i, piece, allPieces = [], possMoves;

        if(side == this.otherColor) {

            for(i = 0; i < this.otherCheckers.length; i++) {

                piece = this.getPieceFromId(this.otherCheckers[i]);
    
                //console.log(piece);
    
                possMoves = this.possibleMoves(piece);
    
                if(possMoves.length > 0)
                    allPieces.push(piece);
            }
        } else {

            for(i = 0; i < this.myCheckers.length; i++) {

                piece = this.getPieceFromId(this.myCheckers[i]);
    
                //console.log(piece);
    
                possMoves = this.possibleMoves(piece);
    
                if(possMoves.length > 0)
                    allPieces.push(piece);
            }
        }

        return allPieces;
    }


    doMove(piece, nextPos) {

        let moved = false, remove = null;

        let checkersLength = piece.side == this.myColor ? this.otherCheckers.length : this.myCheckers.length;

        if(this.isMoveLegal(piece, nextPos)) {

            let newLength = piece.side == this.myColor ? this.otherCheckers.length : this.myCheckers.length;

            if(newLength == checkersLength)
                remove = this.scanBoard(piece, nextPos);

            let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

            if(nextPos.xPos == 0 && newPiece.side == this.myColor && newPiece.stack == 1) 
                newPiece.incrementStack();
            
            if(nextPos.xPos == 7 && newPiece.side == this.otherColor && newPiece.stack == 1) 
                newPiece.incrementStack();

            this.board[nextPos.xPos][nextPos.yPos] = newPiece;
            
            let currPos = piece.getPosition(); 

            this.board[currPos.xPos][currPos.yPos] = null;

            moved = true;
        }

        return { move: moved, id: remove };
    } 


    scanBoard(piece, nextPos) {

        let i, j;

        let remove = null;

        for(i = 0; i < 8; i++) {
            for(j = 0; j < 8; j++) {
                if(this.board[i][j] != null && this.board[i][j].id != piece.id && this.board[i][j].side == piece.side) {
                    if(this.checkPiece(this.board[i][j], piece, nextPos)) {
                        remove = piece.id;
                        break;
                    }
                }
            }
        }

        return remove;
    }

    checkUpperLeft(xPos, yPos) {

        let oneSq = false, twoSq = false;

        if(0 <= xPos - 2 && 0 <= yPos - 2 && xPos - 2 <= 7 && yPos - 2 <= 7)
            twoSq = true;

        if(0 <= xPos - 1 && 0 <= yPos - 1 && xPos - 1 <= 7 && yPos - 1 <= 7)
            oneSq = true;

        return {
            oneSq: oneSq,
            twoSq: twoSq
        }
    }

    checkUpperRight(xPos, yPos) {

        let oneSq = false, twoSq = false;

        if(0 <= xPos - 2 && 0 <= yPos + 2 && xPos - 2 <= 7 && yPos + 2 <= 7)
            twoSq = true;

        if(0 <= xPos - 1 && 0 <= yPos + 1 && xPos - 1 <= 7 && yPos + 1 <= 7)
            oneSq = true;

        return {
            oneSq: oneSq,
            twoSq: twoSq
        }
    }

    checkLowerLeft(xPos, yPos) {

        let oneSq = false, twoSq = false;

        if(0 <= xPos + 2 && 0 <= yPos - 2 && xPos + 2 <= 7 && yPos - 2 <= 7)
            twoSq = true;

        if(0 <= xPos + 1 && 0 <= yPos - 1 && xPos + 1 <= 7 && yPos - 1 <= 7)
            oneSq = true;

        return {
            oneSq: oneSq,
            twoSq: twoSq
        }
    }

    checkLowerRight(xPos, yPos) {

        let oneSq = false, twoSq = false;

        if(0 <= xPos + 2 && 0 <= yPos + 2 && xPos + 2 <= 7 && yPos + 2 <= 7)
            twoSq = true;

        if(0 <= xPos + 1 && 0 <= yPos + 1 && xPos + 1 <= 7 && yPos + 1 <= 7)
            oneSq = true;

        return {
            oneSq: oneSq,
            twoSq: twoSq
        }
    }


    checkPiece(currPiece, piece, nextPos) {

        //console.log(currPiece.id);

        let autoRemove = false;

        let xPos = currPiece.getPosition().xPos;
        let yPos = currPiece.getPosition().yPos;

        if(this.checkUpperLeft(xPos, yPos).twoSq) {
            //console.log("Upper Left");
            if(this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side && this.board[xPos - 2][yPos - 2] == null) {
                //this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Upper Left");
            }
        }

        if(this.checkLowerRight(xPos, yPos).twoSq) {
            //console.log("Lower Right");
            if(!autoRemove && this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                //this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Lower Right");
            }
        }

        if(this.checkUpperRight(xPos, yPos).twoSq) {
            //console.log("Upper Right");
            if(!autoRemove && this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                //this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Upper Right");
            }
        }

        if(this.checkLowerLeft(xPos, yPos).twoSq) {
            //console.log("Lower Left");
            if(!autoRemove && this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                //this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Lower Left");
            }
        }

        if(autoRemove) {

            let myIndex = this.myCheckers.indexOf(this.board[xPos][yPos].id);
            let oppIndex = this.otherCheckers.indexOf(this.board[xPos][yPos].id);

            if(myIndex != -1) 
                this.myCheckers.splice(myIndex, 1);

            if(oppIndex != -1)
                this.otherCheckers.splice(oppIndex, 1);

            this.board[xPos][yPos] = null;
        }

        return autoRemove;
    }


    checkAllPieces() {

        let i, piece;

        for(i = 0; i < this.myCheckers.length; i++) {

            piece = this.getPieceFromId(this.myCheckers[i]);

            if(piece == null) 
                this.myCheckers.splice(i, 1)
        }

        for(i = 0; i < this.otherCheckers.length; i++) {

            piece = this.getPieceFromId(this.otherCheckers[i]);

            if(piece == null) 
                this.otherCheckers.splice(i, 1)
        }
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

    getCheckers() {
        return {
            oppCheck: this.otherCheckers,
            myCheck: this.myCheckers
        }
    }

    getPieceFromId(id) {

        let i, j;

        let piece = null;

        for(i = 0; i < 8; i++) {
            for(j = 0; j < 8; j++) {
                if(this.board[i][j] != null && this.board[i][j].id == id) {
                    piece = this.board[i][j];
                    break;
                }
            }
        }

        return piece;
    }

    getBoard() {
        return this.board;
    }

    suicideMove(possMove, id) {

        let suicide = false;

        let xPos = possMove.x;
        let yPos = possMove.y;

        console.log(possMove);

        if(xPos < 7 || yPos == 0 || yPos == 7) {
            if(this.checkLowerRight(xPos, yPos).oneSq) {
                if(this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side == this.myColor) {
                    if(this.checkUpperLeft(xPos, yPos).oneSq) {
                        if(this.board[xPos - 1][yPos - 1] == null || (this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].id == id)) {
                            console.log("Found Opponent");
                            suicide = true;
                        }
                    }
                }
            }
    
            if(this.checkLowerLeft(xPos, yPos).oneSq) {
                if(this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side == this.myColor) {
                    if(this.checkUpperRight(xPos, yPos).oneSq) {
                        if(this.board[xPos + 1][yPos - 1] == null || (this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].id == id)) {
                            console.log("Found Opponent");
                            suicide = true;
                        }
                    }
                }
            }
    
            if(this.checkUpperRight(xPos, yPos).oneSq) {
                if(this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side == this.myColor) {
                    if(this.checkLowerLeft(xPos, yPos).oneSq) {
                        if(this.board[xPos - 1][yPos + 1] == null || (this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].id == id)) {
                            console.log("Found Opponent");
                            suicide = true;
                        }
                    }
                }
            }
    
            if(this.checkUpperLeft(xPos, yPos).oneSq) {
                if(this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side == this.myColor) {
                    if(this.checkLowerRight(xPos, yPos).oneSq) {
                        if(this.board[xPos + 1][yPos + 1] == null || (this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].id == id)) {
                            console.log("Found Opponent");
                            suicide = true;
                        }
                    }
                }
            }
        }

        if(!suicide)
            return possMove;
        else
            return null;
    }
}