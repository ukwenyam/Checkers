import { Piece } from './Piece.js';
import { Position } from '../Scripts/Position.js';
import { currUser, gamePref } from './Init.js';

export class Board {

    constructor(state, inverted) {

        let myColor, otherColor;

        currUser.update(state => {
            if(state != null) {
                myColor = state.gamePref.myColor;
                otherColor = state.gamePref.otherColor;
            } else {
                myColor = "#ffffff";
                otherColor = "#000000";
            }
            return state;
        });

        if(state == null && !inverted) {

            this.board = [];
            this.myCheckers = [];
            this.otherCheckers = [];

            let i, j, k = 0;

            for(i = 0; i < 8; i++) {

                this.board[i] = [];
            
                for(j = 0; j < 8; j++) {
            
                    let even = (i % 2 == 0) && (j % 2 == 0);
                    let odd = (i % 2 != 0) && (j % 2 != 0);
            
                    if(even || odd || i == 3 || i == 4) {
                    
                        this.board[i][j] = null;

                    } else  {
                        if(0 <= i && i <= 2) {
                            this.board[i][j] = new Piece(i, j, otherColor, k, null);
                            this.otherCheckers.push(k);
                        } else {
                            this.board[i][j] = new Piece(i, j, myColor, k, null);
                            this.myCheckers.push(k);
                        }
                            
                        k++;
                    }
                }
            }

        } else if(state != null && inverted == null) {

            this.board = [];

            let i, j;

            for(i = 0; i < 8; i++) {

                this.board[i] = [];

                for(j = 0; j < 8; j++) {

                    if(state[i][j] != null) {
                        this.board[i][j] = new Piece(i, j, state[i][j].side, state[i][j].id, state[i][j].stack);
                    } else {
                        this.board[i][j] = null;
                    }
                }
            }

        } else if(state == null && inverted) {

            this.board = [];
            this.myCheckers = [];
            this.otherCheckers = [];

            let i, j, k = 23;

            for(i = 0; i < 8; i++) {

                this.board[i] = [];

                for(j = 0; j < 8; j++) {

                    let even = (i % 2 == 0) && (j % 2 == 0);
                    let odd = (i % 2 != 0) && (j % 2 != 0);
            
                    if(even || odd || i == 3 || i == 4) {
                    
                        this.board[i][j] = null;

                    } else  {

                        if(0 <= i && i <= 2) {
                            this.board[i][j] = new Piece(i, j, otherColor, k, null);
                            this.otherCheckers.push(k);
                        } else {
                            this.board[i][j] = new Piece(i, j, myColor, k, null);
                            this.myCheckers.push(k);
                        }
                            
                        k--;
                    }
                }
            }
        }
    }

    saveBoardState() {

		let state = [];
		let i, j;

		for(i = 0; i < 8; i++) {
			state[i] = [];
			for(j = 0; j < 8; j++) {
                if(this.board[i][j] != null) {
                    state[i][j] = {};
                    state[i][j].stack = this.board[i][j].stack;
                    state[i][j].side = this.board[i][j].side;
                    state[i][j].id = this.board[i][j].id;
                }
				else {
                    state[i][j] = null;
                }
			}
		}

		return state;
	}


    takePiece(piece, currPos, yDiff, nextPos) {

        let isTaken = false;
        let xPiece = null;
        let yPiece = null;

        if(nextPos.xPos < currPos.xPos && nextPos.yPos < currPos.yPos) {

            xPiece = currPos.xPos - 1;
            yPiece = currPos.yPos - 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {

                let index;

                if(this.myCheckers.indexOf(this.board[xPiece][yPiece].id) != -1) {
                    index = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
                    this.myCheckers.splice(index, 1);
                } else if(this.otherCheckers.indexOf(this.board[xPiece][yPiece].id) != -1) {
                    index = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
                    this.otherCheckers.splice(index, 1);
                }

                this.board[xPiece][yPiece] = null;
                isTaken = true;
            }
        }

        if(nextPos.xPos < currPos.xPos && nextPos.yPos > currPos.yPos) {

            xPiece = currPos.xPos - 1;
            yPiece = currPos.yPos + 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                let index;

                if(this.myCheckers.indexOf(this.board[xPiece][yPiece].id) != -1) {
                    index = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
                    this.myCheckers.splice(index, 1);
                } else if(this.otherCheckers.indexOf(this.board[xPiece][yPiece].id) != -1) {
                    index = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
                    this.otherCheckers.splice(index, 1);
                }

                this.board[xPiece][yPiece] = null;
                isTaken = true;
            }
        }

        if(nextPos.xPos > currPos.xPos && nextPos.yPos < currPos.yPos) {

            xPiece = currPos.xPos + 1;
            yPiece = currPos.yPos - 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                let index;

                if(this.myCheckers.indexOf(this.board[xPiece][yPiece].id) != -1) {
                    index = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
                    this.myCheckers.splice(index, 1);
                } else if(this.otherCheckers.indexOf(this.board[xPiece][yPiece].id) != -1) {
                    index = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
                    this.otherCheckers.splice(index, 1);
                }

                this.board[xPiece][yPiece] = null;
                isTaken = true;
            }
        }

        if(nextPos.xPos > currPos.xPos && nextPos.yPos > currPos.yPos) {

            xPiece = currPos.xPos + 1;
            yPiece = currPos.yPos + 1;

            if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                let index;

                if(this.myCheckers.indexOf(this.board[xPiece][yPiece].id) != -1) {
                    index = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
                    this.myCheckers.splice(index, 1);
                } else if(this.otherCheckers.indexOf(this.board[xPiece][yPiece].id) != -1) {
                    index = this.myCheckers.indexOf(this.board[xPiece][yPiece].id);
                    this.otherCheckers.splice(index, 1);
                }

                this.board[xPiece][yPiece] = null;
                isTaken = true;
            }
        }

        return isTaken;
    }
    

    possibleMoves(piece) {

        let moves = [];
        let move;

        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        let myColor, otherColor;

        currUser.update(state => {
            if(state != null) {
                myColor = state.gamePref.myColor;
                otherColor = state.gamePref.otherColor;
            } else {
                myColor = "#ffffff";
                otherColor = "#000000";
            }
            return state;
        });

        if((0 <= xPos - 2 || 0 <= xPos - 1) && (0 <= yPos - 2 || 0 <= yPos - 1) && (xPos - 2 <= 7 || xPos - 1 <= 7) && (yPos - 2 <= 7 || yPos - 1 <= 7)) {
            //console.log("Upper Left");
            if(this.board[xPos - 1][yPos - 1] == null) {
                move = {
                    x: xPos - 1,
                    y: yPos - 1 
                }

                moves.push(move);
                //console.log("Upper Left");
            } else if(this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side && this.board[xPos - 2][yPos - 2] == null) {
                move = {
                    x: xPos - 2,
                    y: yPos - 2 
                }

                moves.push(move);
            }
        }

        if((0 <= xPos + 2 || 0 <= xPos + 1) && (0 <= yPos + 2 || 0 <= yPos + 1) && (xPos + 2 <= 7 || xPos + 1 <= 7) && (yPos + 2 <= 7 || yPos + 1 <= 7)) {
            //console.log("Lower Right");
            if(this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                move = {
                    x: xPos + 2,
                    y: yPos + 2 
                }

                moves.push(move);
                //console.log("Lower Right");
            } else if(this.board[xPos + 1][yPos + 1] == null && piece.stack > 1) {
                move = {
                    x: xPos + 1,
                    y: yPos + 1 
                }

                moves.push(move);
            } else if(this.board[xPos + 1][yPos + 1] == null && piece.side == otherColor) {
                move = {
                    x: xPos + 1,
                    y: yPos + 1 
                }

                moves.push(move);
            }
        }

        if((0 <= xPos - 2 || 0 <= xPos - 1) && (0 <= yPos + 2 || 0 <= yPos + 1) && (xPos - 2 <= 7 || xPos - 1 <= 7) && (yPos + 2 <= 7 || yPos + 1 <= 7)) {
            //console.log("Upper Right");
            if(this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                move = {
                    x: xPos - 2,
                    y: yPos + 2 
                }

                moves.push(move);
                //console.log("Upper Right");
            } else if(this.board[xPos - 1][yPos + 1] == null) {
                move = {
                    x: xPos - 1,
                    y: yPos + 1 
                }

                moves.push(move);
            }
        }

        if((0 <= xPos + 2 || 0 <= xPos + 1) && (0 <= yPos - 2 || 0 <= yPos - 1) && (xPos + 2 <= 7 || xPos + 1 <= 7) && (yPos - 2 <= 7 || yPos - 1 <= 7)) {
            //console.log("Lower Left");
            if(this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                move = {
                    x: xPos + 2,
                    y: yPos - 2 
                }

                moves.push(move);
                //console.log("Lower Left");
            } else if(this.board[xPos + 1][yPos - 1] == null && piece.stack > 1) {
                move = {
                    x: xPos + 1,
                    y: yPos - 1 
                }

                moves.push(move);
            } else if(this.board[xPos + 1][yPos - 1] == null && piece.side == otherColor) {
                move = {
                    x: xPos + 1,
                    y: yPos - 1 
                }

                moves.push(move);
            }
        }
        
        return moves;
    }


    isMoveLegal(piece, nextPos) {

        let myColor, otherColor;

        currUser.update(state => {
            if(state != null) {
                myColor = state.gamePref.myColor;
                otherColor = state.gamePref.otherColor;
            } else {
                myColor = "#ffffff";
                otherColor = "#000000";
            }
            return state;
        });

        let legal = false;

        let currPos = piece.getPosition();

        console.log(nextPos.isEmpty);
        console.log(piece.side);

        if(piece.side == myColor && nextPos.isEmpty) {

            console.log(currPos.xPos + ", " + currPos.yPos + " --> " + nextPos.xPos + ", " + nextPos.yPos);

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

        if(piece.side == otherColor && nextPos.isEmpty) {

            console.log(currPos.xPos + ", " + currPos.yPos + " --> " + nextPos.xPos + ", " + nextPos.yPos);

            let xDiff = currPos.xPos - nextPos.xPos;

            let yDiff = currPos.yPos - nextPos.yPos;

            if(piece.stack == 1) {

                console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

                let oneSq = (yDiff == 1 || yDiff == -1) && xDiff == -1;

                console.log(oneSq);

                let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                if(oneSq) {
                    console.log(nextPos.xPos + ", " + nextPos.yPos);
                    legal = true;
                }

                if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                    console.log(nextPos.xPos + ", " + nextPos.yPos);
                    legal = true;
                }
                    

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

        let myColor, otherColor;

        currUser.update(state => {
            if(state != null) {
                myColor = state.gamePref.myColor;
                otherColor = state.gamePref.otherColor;
            } else {
                myColor = "#ffffff";
                otherColor = "#000000";
            }
            return state;
        });

        let moved = false, remove = null;

        if(this.isMoveLegal(piece, nextPos)) {

            remove = this.scanBoard(piece, nextPos);

            let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

            if(newPiece.side == myColor) {
                if(nextPos.xPos == 0 && newPiece.side == myColor && newPiece.stack == 1) 
                    newPiece.incrementStack();
            } 
            
            if(newPiece.side == otherColor) {
                if(nextPos.xPos == 0 && newPiece.side == otherColor && newPiece.stack == 1) 
                    newPiece.incrementStack();
            }

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
            if(!autoRemove && this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Lower Right");
            }
        }

        if(0 <= xPos - 2 && 0 <= yPos + 2 && xPos - 2 <= 7 && yPos + 2 <= 7) {
            //console.log("Upper Right");
            if(!autoRemove && this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Upper Right");
            }
        }

        if(0 <= xPos + 2 && 0 <= yPos - 2 && xPos + 2 <= 7 && yPos - 2 <= 7) {
            //console.log("Lower Left");
            if(!autoRemove && this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                this.board[xPos][yPos] = null;
                autoRemove = true;
                //console.log("Lower Left");
            }
        }

        return autoRemove;
    }


    removePiece(piece) {
        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        this.board[xPos][yPos] = null;
    }


    otherPlayerMove(piece, xDiff, yDiff) {

        let mySide;
        
        gamePref.update(state => {
            mySide = state.side;
            return state;
        });

        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        let nextPosX = xPos + xDiff;
        let nextPosY = yPos + yDiff;

        //console.log(xPos + ", " + yPos + " --> " + nextPosX+ ", " + nextPosY);
        //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

        let newPiece = new Piece(nextPosX, nextPosY, piece.side, piece.id, piece.stack);

        if(newPiece.side == mySide) {

            if(nextPosX == 0 && newPiece.side == "white" && newPiece.stack == 1) 
                newPiece.incrementStack();
        } 
        
        if(newPiece.side == mySide) {

            if(nextPosX == 0 && newPiece.side == "black" && newPiece.stack == 1) 
                newPiece.incrementStack();
        }

        this.board[nextPosX][nextPosY] = newPiece;

        if(xDiff == 2 && yDiff == 2) {

            nextPosX = xPos + (xDiff / 2);
            nextPosY = yPos + (yDiff / 2);

            this.board[nextPosX][nextPosY] = null;
        }

        this.board[xPos][yPos] = null;
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

    getPieceFromId(id) {

        let i, j;

        let piece;

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

    easyMove() {

        console.log("Computer Making move");
        let move, randIndex, piece, possMoves = [];

        while(possMoves.length == 0) {
            console.log("Looking for another piece");
            randIndex = Math.floor(Math.random() * this.otherCheckers.length);
            piece = this.getPieceFromId(this.otherCheckers[randIndex]);
            possMoves = this.possibleMoves(piece);

            if(possMoves.length > 0)
                break;
        }

        console.log("Making Move");
        let randMove = Math.floor(Math.random() * possMoves.length);
        let nextPos = new Position(possMoves[randMove].x, possMoves[randMove].y, 'E');
        move = this.doMove(piece, nextPos);

        return move;
    }

    medMove() {

        console.log("Computer Making move");
        let move, nextPos, piece, possMoves = [];

        for(let i = 0; i < this.otherCheckers.length; i++) {
            piece = this.getPieceFromId(this.otherCheckers[i]);
            possMoves = this.possibleMoves(piece);

            if(possMoves.length > 0) {
                let xPos = piece.getPosition().xPos;
                let yPos = piece.getPosition().yPos;

                for(let j = 0; j < possMoves.length; j++) {
                    
                    let xDiff = xPos - possMoves[j].x;
                    let yDiff = yPos - possMoves[j].y;

                    if((xDiff > 1 && yDiff > 1) || (xDiff < -1 && yDiff < -1) || (xDiff < -1 && yDiff > 1) && (xDiff > 1 && yDiff < -1)) {
                        nextPos = new Position(possMoves[j].x, possMoves[j].y, 'E');
                        break;
                    }
                }
            }
        }

        if(nextPos == null) 
            move = this.easyMove();
        else
            move = this.doMove(piece, nextPos);

        return move;
    }
}