import { Piece } from './Piece.js';
//import { Position } from '../Scripts/Position.js';
import { currUser, gamePref } from './Init.js';

export class Board {

    constructor(state, inverted) {

        if(state == null && !inverted) {

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
                            this.board[i][j] = new Piece(i, j, "black", k, null);
                            
                        else 
                            this.board[i][j] = new Piece(i, j, "red", k, null);

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

            let i, j, k = 23;

            for(i = 0; i < 8; i++) {

                this.board[i] = [];

                for(j = 0; j < 8; j++) {

                    let even = (i % 2 == 0) && (j % 2 == 0);
                    let odd = (i % 2 != 0) && (j % 2 != 0);
            
                    if(even || odd || i == 3 || i == 4) {
                    
                        this.board[i][j] = null;

                    } else  {

                        if(0 <= i && i <= 2)
                            this.board[i][j] = new Piece(i, j, "red", k, null);
                            
                        else 
                            this.board[i][j] = new Piece(i, j, "black", k, null);

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
                if(this.board[i][j] != null)
					state[i][j] = this.board[i][j];
				else
					state[i][j] = null;
			}
		}

		return state;
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

        let name, priPlayer, secPlayer;

        currUser.update(state => {
            name = state.name;
            return state;
        });
        
        gamePref.update(state => {
            priPlayer = state.pri;
            secPlayer = state.sec;
            return state
        });

        let legal = false;

        let currPos = piece.getPosition();

        /* if(piece.side == "black" && nextPos.isEmpty) {

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
        } */

        console.log(nextPos.isEmpty);

        console.log("red: " + piece.side == "red");
        console.log("black: " + piece.side == "black");

        if(piece.side == "red" && nextPos.isEmpty && name == priPlayer) {

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

        if(piece.side == "black" && nextPos.isEmpty && name == secPlayer) {

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

                if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                    //console.log(nextPos.xPos + ", " + nextPos.yPos);
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

        let name, priPlayer, secPlayer;

        currUser.update(state => {
            name = state.name;
            return state;
        });
        
        gamePref.update(state => {
            priPlayer = state.pri;
            secPlayer = state.sec;
            return state
        });

        let moved = false, remove = null;

        if(this.isMoveLegal(piece, nextPos)) {

            remove = this.scanBoard(piece, nextPos);

            let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

            if(name == priPlayer) {

                if(nextPos.xPos == 0 && newPiece.side == "red" && newPiece.stack == 1) 
                    newPiece.incrementStack();
            } 
            
            if(name == secPlayer) {

                if(nextPos.xPos == 0 && newPiece.side == "black" && newPiece.stack == 1) 
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


    removePiece(piece) {
        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        this.board[xPos][yPos] = null;
    }


    otherPlayerMove(piece, xDiff, yDiff) {

        let name, priPlayer, secPlayer;

        currUser.update(state => {
            name = state.name;
            return state;
        });
        
        gamePref.update(state => {
            priPlayer = state.pri;
            secPlayer = state.sec;
            return state
        });

        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        let nextPosX = xPos + xDiff;
        let nextPosY = yPos + yDiff;

        //console.log(xPos + ", " + yPos + " --> " + nextPosX+ ", " + nextPosY);
        //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

        let newPiece = new Piece(nextPosX, nextPosY, piece.side, piece.id, piece.stack);

        if(name == priPlayer) {

            if(nextPosX == 0 && newPiece.side == "red" && newPiece.stack == 1) 
                newPiece.incrementStack();
        } 
        
        if(name == secPlayer) {

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
                if(this.board[i][j] != null) {
                    if(this.board[i][j].id == id) {
                        piece = this.board[i][j];
                        break;
                    }
                }
            }
        }

        return piece;
    }

    getBoard() {
        return this.board;
    }

}