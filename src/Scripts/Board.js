import { Piece } from './Piece.js';
import { Position } from '../Scripts/Position.js';
import { currUser, gamePref } from './Init.js';
import { SimBoard } from './SimBoard.js';

export class Board {

    constructor(state, inverted) {

        this.currPiece = null;
        this.tries = 0;
        this.makingMove = false;

        this.myColor = null;
        this.otherColor = null;

        this.board = [];
        this.myCheckers = [];
        this.otherCheckers = [];

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

        if(state == null && !inverted) {

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
                            this.board[i][j] = new Piece(i, j, this.otherColor, k, null);
                            this.otherCheckers.push(k);
                        } else {
                            this.board[i][j] = new Piece(i, j, this.myColor, k, null);
                            this.myCheckers.push(k);
                        }
                            
                        k++;
                    }
                }
            }

        } else if(state != null && inverted == null) {

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
                            this.board[i][j] = new Piece(i, j, this.otherColor, k, null);
                            this.otherCheckers.push(k);
                        } else {
                            this.board[i][j] = new Piece(i, j, this.myColor, k, null);
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


    allMovablePieces() {

        console.log("Getting All Moveable Piece");

        let piece, allPieces = [], possMoves;

        let oppLength = this.otherCheckers.length;

        for(let i = 0; i < oppLength; i++) {

            piece = this.getPieceFromId(this.otherCheckers[i]);

            possMoves = this.possibleMoves(piece);

            if(possMoves.length > 0)
                allPieces.push(piece);
        }

        return allPieces;
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


    otherPlayerMove(piece, xDiff, yDiff) {

        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        let nextPosX = xPos + xDiff;
        let nextPosY = yPos + yDiff;

        //console.log(xPos + ", " + yPos + " --> " + nextPosX+ ", " + nextPosY);
        //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

        let newPiece = new Piece(nextPosX, nextPosY, piece.side, piece.id, piece.stack);

        if(newPiece.side == this.myColor) {
            if(nextPosX == 0 && newPiece.side == myColor && newPiece.stack == 1) 
                newPiece.incrementStack();
        } 
        
        if(newPiece.side == this.otherColor) {
            if(nextPosX == 0 && newPiece.side == otherColor && newPiece.stack == 1) 
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


    totalPossibleMoves() {

        let count = 0;

        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                if(this.board[i][j] != null) {
                    count += this.possibleMoves(this.board[i][j]).length;
                }
            }
        }

        return count;
    }

    evaluateBoard(board) {

        let playNumPieces = board.myCheckers.length;
        let compKings = 0;
        let compNumPieces = board.otherCheckers.length;
        let playKings = 0;
        let compPosSum = 0;
        let playPosSum = 0;

        let i, piece;

        for(i = 0; i < board.myCheckers.length; i++) {

            piece = board.getPieceFromId(board.myCheckers[i]);

            if(piece.stack > 1) 
                playKings++;

            playPosSum += board.possibleMoves(piece).length;
        }

        for(i = 0; i < board.otherCheckers.length; i++) {

            piece = board.getPieceFromId(board.otherCheckers[i]);

            if(piece.stack > 1) 
                compKings++;
            
            compPosSum += board.possibleMoves(piece).length;
        }

        let pieceDiff = compNumPieces - playNumPieces;
        let kingDiff = compKings - playKings;

        if(playNumPieces == 0)
            playNumPieces = 0.01;

        if(compNumPieces == 0)
            compNumPieces = 0.01;

        let avgPlayPieces = playPosSum / playNumPieces; 
        let avgCompPieces = compPosSum / compNumPieces;

        let avgPosDiff = avgCompPieces - avgPlayPieces;

        let nodes = [pieceDiff, kingDiff, avgPosDiff];

        let weights = [1000, 100, 10];

        let score = 0;

        for(i = 0; i < nodes.length; i++)
            score += nodes[i] * weights[i];

        return score;
    }

    miniMax(simBoard, depth, isMaximizing, alpha, beta) {

        console.log(depth);
        console.log(isMaximizing);

        if(depth == 0) {

            console.log("Evaluating Board");
            return this.evaluateBoard(simBoard);

        } else {

            let gameSim, bestScore;

            if(isMaximizing) {

                console.log("Maximizing Move");

                let allPieces = simBoard.allMovablePieces(simBoard.otherColor);

                //console.log(allPieces);

                for(let i = 0; i < allPieces.length; i++) {

                    if(alpha >= beta)
                        break;

                    bestScore = -Infinity;

                    let possMoves = simBoard.possibleMoves(allPieces[i]);

                    for(let j = 0; j < possMoves.length; j++) {

                        gameSim = new SimBoard(simBoard.board);

                        gameSim.doMove(allPieces[i], possMoves[j]);

                        console.log("Switching to Player");

                        let score = this.miniMax(gameSim, depth - 1, !isMaximizing, alpha, beta);

                        console.log(score);

                        bestScore = Math.max(score, bestScore);

                        alpha = Math.max(alpha, bestScore);

                        if(alpha >= beta)
                            break;
                    }
                }

            } else {

                console.log("Minimizing Move");

                let allPieces = simBoard.allMovablePieces(simBoard.myColor);

                //console.log(allPieces);

                for(let i = 0; i < allPieces.length; i++) {

                    if(alpha >= beta)
                        break;

                    bestScore = Infinity;

                    let possMoves = simBoard.possibleMoves(allPieces[i]);

                    for(let j = 0; j < possMoves.length; j++) {

                        gameSim = new SimBoard(simBoard.board);

                        gameSim.doMove(allPieces[i], possMoves[j]);

                        console.log("Switching to Computer");

                        let score = this.miniMax(gameSim, depth - 1, !isMaximizing, alpha, beta);

                        console.log(score);

                        bestScore = Math.min(score, bestScore);

                        alpha = Math.min(alpha, bestScore);

                        if(alpha >= beta)
                            break;
                    }
                }
            }

            return bestScore;
        }
    }

    computerMove() {

        let winner = null;

        this.checkAllPieces();

        if(this.myCheckers.length > 1 && this.otherCheckers.length > 1) {

            let allPieces = this.allMovablePieces();

            let depth = this.totalPossibleMoves();

            let nextPos, piece;

            for(let i = 0; i < allPieces.length; i++) {

                let alpha = -Infinity;
                let beta = Infinity;

                let bestScore = -Infinity;

                let possMoves = this.possibleMoves(allPieces[i]);

                for(let j = 0; j < possMoves.length; j++) {

                    let gameSim = new SimBoard(this.board);

                    gameSim.doMove(allPieces[i], possMoves[j]);

                    let score = this.miniMax(gameSim, 4, false, alpha, beta);

                    console.log(score);

                    if(score > bestScore) {
                        console.log("Updating Score");
                        bestScore = score;
                        piece = allPieces[i];
                        nextPos = new Position(possMoves[j].x, possMoves[j].y, 'E');
                    }
                }
            }

            let wait = setInterval(() => {

                if(piece != null && nextPos != null) {

                    console.log(piece.getPosition());
                    console.log(nextPos);

                    console.log("Making Move");

                    clearInterval(wait);

                    let moved = this.doMove(piece, nextPos);

                    console.log(moved);

                    this.checkAllPieces();
                }
            }, 500);

            return winner;

        } else {

            if(this.myCheckers.length <= 1) 
                winner = "Opponent";
            else    
                winner = "You";

            return winner;
        }
    }

    easyMove() {

        console.log("Computer Making Easy Move");
        let randIndex, piece, possMoves = [], nextPos, randMove, result;

        do {
            console.log("Looking for another piece");
            randIndex = Math.floor(Math.random() * this.otherCheckers.length);
            piece = this.getPieceFromId(this.otherCheckers[randIndex]);

            if(piece != null) {
                possMoves = this.possibleMoves(piece);

                if(possMoves.length > 0) {
                    randMove = Math.floor(Math.random() * possMoves.length);
                    break;
                }
            } 
        } while(possMoves.length == 0);

        console.log("Making Move");
        
        console.log(piece.getPosition());

        let smartMove = this.suicideMove(possMoves[randMove], piece.id);

        if(smartMove != null && this.tries <= this.otherCheckers.length) {

            nextPos = new Position(smartMove.x, smartMove.y, 'E');

            this.tries = 0;

            result = {
                piece: piece,
                nextPos: nextPos
            }
        } else {

            if(this.tries <= this.otherCheckers.length) {
                console.log("Trying Again");
                this.tries += 1;
                this.easyMove();
            } 

            console.log("Taking Risk");
            
            nextPos = new Position(possMoves[randMove].x, possMoves[randMove].y, 'E');

            this.tries = 0;

            result = {
                piece: piece,
                nextPos: nextPos
            }
        } 

        return result;
    }

    medMove(currPiece) {

        console.log("Computer Making Medium Move");
        let nextPos = null, piece, possMoves = [], result = null;
        console.log(this.otherCheckers);

        if(currPiece != null) {

            piece = currPiece;

            console.log(piece);
            possMoves = this.possibleMoves(piece);
            console.log(possMoves);

            if(possMoves.length > 0) {

                let xPos = piece.getPosition().xPos;
                let yPos = piece.getPosition().yPos;

                for(let j = 0; j < possMoves.length; j++) {
                    
                    let xDiff = xPos - possMoves[j].x;
                    let yDiff = yPos - possMoves[j].y;

                    console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

                    if((xDiff > 1 && yDiff > 1) || (xDiff < -1 && yDiff < -1) || (xDiff < -1 && yDiff > 1) || (xDiff > 1 && yDiff < -1)) {
                        console.log("Taking Piece");
                        nextPos = new Position(possMoves[j].x, possMoves[j].y, 'E');

                        result = {
                            piece: piece,
                            nextPos: nextPos
                        };

                        break;
                    }
                }
            }
        } else {

            for(let i = 0; i < this.otherCheckers.length; i++) {

                if(nextPos != null)
                    break;
    
                piece = this.getPieceFromId(this.otherCheckers[i]);
                if(piece != null) {
                    console.log(piece);
                    possMoves = this.possibleMoves(piece);
                    console.log(possMoves);
        
                    if(possMoves.length > 0) {
                        let xPos = piece.getPosition().xPos;
                        let yPos = piece.getPosition().yPos;
        
                        for(let j = 0; j < possMoves.length; j++) {
                            
                            let xDiff = xPos - possMoves[j].x;
                            let yDiff = yPos - possMoves[j].y;
    
                            console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);
        
                            if((xDiff > 1 && yDiff > 1) || (xDiff < -1 && yDiff < -1) || (xDiff < -1 && yDiff > 1) || (xDiff > 1 && yDiff < -1)) {
                                console.log("Taking Piece");
                                nextPos = new Position(possMoves[j].x, possMoves[j].y, 'E');

                                result = {
                                    piece: piece,
                                    nextPos: nextPos
                                };

                                break;
                            }
                        }
                    }
                }
            }
        }

        return result;
    }


    hardMove() {

        console.log("Computer Making Hard Move");

        let nextPos = null, myPiece, oppPiece, result = null;

        for(let i = 0; i < this.myCheckers.length; i++) {
            for(let j = 0; j < this.otherCheckers.length; j++) {

                if(result != null)
                    break;

                myPiece = this.getPieceFromId(i);
                oppPiece = this.getPieceFromId(j);

                if(myPiece != null && oppPiece != null) {

                    let myPossMoves = this.possibleMoves(myPiece);
                    let oppPossMoves = this.possibleMoves(oppPiece);

                    if(myPossMoves.length > 0 && oppPossMoves.length > 0) {

                        let myXPos = myPiece.getPosition().xPos;
                        let myYPos = myPiece.getPosition().yPos;

                        let oppXPos = oppPiece.getPosition().xPos;
                        let oppYPos = oppPiece.getPosition().yPos;

                        for(let x = 0; x < myPossMoves.length; x++) {
                            for(let y = 0; y < oppPossMoves.length; y++) {
                                if(myPossMoves[x].x == oppPossMoves[y].x && myPossMoves[x].y == oppPossMoves[y].y) {

                                    let myXDiff = myXPos - myPossMoves[x].x;
                                    let myYDiff = myYPos - myPossMoves[x].y;

                                    let oppXDiff = oppXPos - oppPossMoves[y].x;
                                    let oppYDiff = oppYPos - oppPossMoves[y].y;

                                    //console.log("myXDiff:" + myXDiff + ", myYDiff:" + myYDiff);
                                    //console.log("oppXDiff:" + oppXDiff + ", oppYDiff:" + oppYDiff);

                                    if((myXDiff > 1 && myYDiff > 1) || (myXDiff < -1 && myYDiff > 1) || (myXDiff < -1 && myYDiff < -1) || (myXDiff > 1 && myYDiff < -1)) {

                                        if((oppXDiff == -1 && oppYDiff == -1) || (oppXDiff == 1 && oppYDiff == -1)) {
                                            nextPos = new Position(myPossMoves[x].x, myPossMoves[x].y, 'E');
                                            result = {
                                                piece: myPiece,
                                                nextPos: nextPos
                                            }
                                            console.log("Found Blockage");
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return result;
    }
}