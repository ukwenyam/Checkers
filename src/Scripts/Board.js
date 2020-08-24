import { Piece } from './Piece.js';
import { Position } from '../Scripts/Position.js';
import { currUser } from './Init.js';

export class Board {

    constructor(state, inverted) {

        this.numMoves = 0;

        this.myColor = null;
        this.otherColor = null;

        this.board = [];
        this.myCheckers = [];
        this.otherCheckers = [];

        currUser.update(state => {
            if(state != null) {
                this.myColor = state.gamePreferences.myColor;
                this.otherColor = state.gamePreferences.otherColor;
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

                    if(state.board[i][j] != null) {
                        this.board[i][j] = new Piece(i, j, state.board[i][j].side, state.board[i][j].id, state.board[i][j].stack);
                    } else {
                        this.board[i][j] = null;
                    }
                }
            }

            this.numMoves = state.numMoves;

            if(state.myCheckers != null)
                this.myCheckers = state.myCheckers;

            if(state.otherCheckers != null)
                this.otherCheckers = state.otherCheckers;
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

        let game = new Board(null, false);

        game.board = state;

        game.numMoves = this.numMoves;

        game.myCheckers = this.myCheckers;
        game.otherCheckers = this.otherCheckers;

        game.myColor = this.myColor;
        game.otherColor = this.otherColor;

		return game;
    }

    normalizeBoard() {

        let state = [];
        let i, j, k;

        for(i = 0; i < 5; i++) {

            if(i == 0) {

                for(j = 0; j < 8; j++) {
                    for(k = 0; k < 8; k++) {
                        if(this.board[j][k] != null && this.board[j][k].side == this.otherColor && this.board[j][k].stack == 2) {
                            state.push(1);
                        } else {
                            state.push(0);
                        }
                    }
                }

            } else if(i == 1) {

                for(j = 0; j < 8; j++) {
                    for(k = 0; k < 8; k++) {
                        if(this.board[j][k] != null && this.board[j][k].side == this.otherColor && this.board[j][k].stack == 1) {
                            state.push(1);
                        } else {
                            state.push(0);
                        }
                    }
                }

            } else if(i == 2) {

                for(j = 0; j < 8; j++) {
                    for(k = 0; k < 8; k++) {
                        if(this.board[j][k] == null) {
                            state.push(1);
                        } else {
                            state.push(0);
                        }
                    }
                }

            } else if(i == 3) {

                for(j = 0; j < 8; j++) {
                    for(k = 0; k < 8; k++) {
                        if(this.board[j][k] != null && this.board[j][k].side == this.myColor && this.board[j][k].stack == 1) {
                            state.push(1);
                        } else {
                            state.push(0);
                        }
                    }
                }

            } else if(i == 4) {

                for(j = 0; j < 8; j++) {
                    for(k = 0; k < 8; k++) {
                        if(this.board[j][k] != null && this.board[j][k].side == this.myColor && this.board[j][k].stack == 2) {
                            state.push(1);
                        } else {
                            state.push(0);
                        }
                    }
                }

            }
        }

        return state;
    }


    takePiece(piece) {

        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        let myIndex = this.myCheckers.indexOf(this.board[xPos][yPos].id);
        let oppIndex = this.otherCheckers.indexOf(this.board[xPos][yPos].id);

        if(oppIndex != -1) 
            this.otherCheckers.splice(oppIndex, 1);

        if(myIndex != -1) 
            this.myCheckers.splice(myIndex, 1);
            
        this.board[xPos][yPos] = null;
    }


    allMovablePieces(side) {

        let i, piece, allPieces = [], possMoves;

        if(side == this.otherColor) {

            for(i = 0; i < this.otherCheckers.length; i++) {

                piece = this.getPieceFromId(this.otherCheckers[i]);
    
                //console.log(piece);
    
                possMoves = this.possibleMoves(piece, null);
    
                if(possMoves.length > 0)
                    allPieces.push(piece);
            }
        } else {

            for(i = 0; i < this.myCheckers.length; i++) {

                piece = this.getPieceFromId(this.myCheckers[i]);
    
                //console.log(piece);
    
                possMoves = this.possibleMoves(piece, null);
    
                if(possMoves.length > 0)
                    allPieces.push(piece);
            }
        }

        return allPieces;
    }
    

    checkPieceHistory(piece, history) {

        let been = false;

        for(let i = 0; i < history.length; i++) {

            let xPos = history[i].getPosition().xPos;
            let yPos = history[i].getPosition().yPos;

            if(xPos == piece.xPos && piece.yPos == yPos) {
                been = true;
                break;
            }
        }

        return been;
    }
    

    possibleMoves(piece, prevPos) {

        let moves = [];
        let move;

        let xPos = piece.getPosition().xPos;
        let yPos = piece.getPosition().yPos;

        if(this.checkUpperLeft(xPos, yPos).twoSq) {

            if(prevPos != null) {

                let newPos = new Position(xPos - 2, yPos - 2, piece.side);

                if(!this.checkPieceHistory(newPos, prevPos)) {
                    if(this.board[xPos - 2][yPos - 2] == null && this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side) {
                        move = {
                            x: xPos - 2,
                            y: yPos - 2,
                            piece: {
                                x: xPos - 1,
                                y: yPos - 1
                            }
                        }
                        moves.push(move);
        
                        let newMoves = [];
        
                        prevPos.push(piece);
                        
                        piece = new Piece(move.x, move.y, piece.side, piece.side, piece.stack);
        
                        newMoves = this.possibleMoves(piece, prevPos);
        
                        if(newMoves.length > 0)
                            for(let i = 0; i < newMoves.length; i++)
                                moves.push(newMoves[i]);
                    }
                }

            } else {

                if(this.board[xPos - 2][yPos - 2] == null && this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side) {
                    move = {
                        x: xPos - 2,
                        y: yPos - 2,
                        piece: {
                            x: xPos - 1,
                            y: yPos - 1
                        }
                    }
                    moves.push(move);
    
                    let newMoves = [], prevPos = [];
    
                    prevPos.push(piece);
                    
                    piece = new Piece(move.x, move.y, piece.side, piece.side, piece.stack);
    
                    newMoves = this.possibleMoves(piece, prevPos);
    
                    if(newMoves.length > 0)
                        for(let i = 0; i < newMoves.length; i++)
                            moves.push(newMoves[i]);
                }
            }
        }

        if(this.checkUpperRight(xPos, yPos).twoSq ) {

            if(prevPos != null) {

                let newPos = new Position(xPos - 2, yPos + 2, piece.side);

                if(!this.checkPieceHistory(newPos, prevPos)) {
                    if(this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                        move = {
                            x: xPos - 2,
                            y: yPos + 2,
                            piece: {
                                x: xPos - 1,
                                y: yPos + 1
                            } 
                        }
                        moves.push(move);
        
                        let newMoves = [];
                        
                        prevPos.push(piece);
                        
                        piece = new Piece(move.x, move.y, piece.side, piece.id, piece.stack);
        
                        newMoves = this.possibleMoves(piece, prevPos);
        
                        if(newMoves.length > 0)
                            for(let i = 0; i < newMoves.length; i++)
                                moves.push(newMoves[i]);
                    }
                }
            } else {

                if(this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                    move = {
                        x: xPos - 2,
                        y: yPos + 2,
                        piece: {
                            x: xPos - 1,
                            y: yPos + 1
                        } 
                    }
                    moves.push(move);
                    
                    let newMoves = [], prevPos = [];
    
                    prevPos.push(piece);
                    
                    piece = new Piece(move.x, move.y, piece.side, piece.id, piece.stack);
    
                    newMoves = this.possibleMoves(piece, prevPos);
    
                    if(newMoves.length > 0)
                        for(let i = 0; i < newMoves.length; i++)
                            moves.push(newMoves[i]);
                }
            }
        }

        if(this.checkLowerLeft(xPos, yPos).twoSq) {

            if(prevPos != null) {

                let newPos = new Position(xPos + 2, yPos - 2, piece.side);

                if(!this.checkPieceHistory(newPos, prevPos)) {
                    if(this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                        move = {
                            x: xPos + 2,
                            y: yPos - 2,
                            piece: {
                                x: xPos + 1,
                                y: yPos - 1
                            } 
                        }
                        moves.push(move);
        
                        let newMoves = [];
                        
                        prevPos.push(piece);
                        
                        piece = new Piece(move.x, move.y, piece.side, piece.id, piece.stack);
        
                        newMoves = this.possibleMoves(piece, prevPos);
        
                        if(newMoves.length > 0)
                            for(let i = 0; i < newMoves.length; i++)
                                moves.push(newMoves[i]);
                    }
                }
            } else {

                if(this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                    move = {
                        x: xPos + 2,
                        y: yPos - 2,
                        piece: {
                            x: xPos + 1,
                            y: yPos - 1
                        } 
                    }
                    moves.push(move);
    
                    let newMoves = [], prevPos = [];
    
                    prevPos.push(piece);
                    
                    piece = new Piece(move.x, move.y, piece.side, piece.id, piece.stack);
    
                    newMoves = this.possibleMoves(piece, prevPos);
    
                    if(newMoves.length > 0)
                        for(let i = 0; i < newMoves.length; i++)
                            moves.push(newMoves[i]);
                }
            }
        }

        if(this.checkLowerRight(xPos, yPos).twoSq) {

            if(prevPos != null) {

                let newPos = new Position(xPos + 2, yPos + 2, piece.side);

                if(!this.checkPieceHistory(newPos, prevPos)) {
                    if(this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                        move = {
                            x: xPos + 2,
                            y: yPos + 2,
                            piece: {
                                x: xPos + 1,
                                y: yPos + 1
                            } 
                        }
                        moves.push(move);
        
                        let newMoves = [];
                        
                        prevPos.push(piece);
                        
                        piece = new Piece(move.x, move.y, piece.side, piece.id, piece.stack);
        
                        newMoves = this.possibleMoves(piece, prevPos);
        
                        if(newMoves.length > 0)
                            for(let i = 0; i < newMoves.length; i++)
                                moves.push(newMoves[i]);
                    }
                }

            } else {

                if(this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                    move = {
                        x: xPos + 2,
                        y: yPos + 2,
                        piece: {
                            x: xPos + 1,
                            y: yPos + 1
                        } 
                    }
                    moves.push(move);
    
                    let newMoves = [], prevPos = [];
    
                    prevPos.push(piece);
                    
                    piece = new Piece(move.x, move.y, piece.side, piece.id, piece.stack);
    
                    newMoves = this.possibleMoves(piece, prevPos);
    
                    if(newMoves.length > 0)
                        for(let i = 0; i < newMoves.length; i++)
                            moves.push(newMoves[i]);
                }
            }
        }

        if(moves.length == 0) {

            if(this.checkUpperLeft(xPos, yPos).oneSq && prevPos == null) {
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

            if(this.checkUpperRight(xPos, yPos).oneSq && prevPos == null) {
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

            if(this.checkLowerLeft(xPos, yPos).oneSq && prevPos == null) {
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

            if(this.checkLowerRight(xPos, yPos).oneSq && prevPos == null) {
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

        }

        return moves;
    }


    isMoveLegal(piece, nextPos) {

        let legal = false, tookPiece = false;

        let possMoves = this.aStarSearch(piece, nextPos, this.possibleMoves(piece, null));

        for(let i = 0; i < possMoves.length; i++) {

            let xPos = possMoves[i].x;
            let yPos = possMoves[i].y;

            if(possMoves[i].piece != null) {

                let xCoord = possMoves[i].piece.x;
                let yCoord = possMoves[i].piece.y;

                let side = piece.side == this.myColor ? this.otherColor : this.myColor;
                let id = this.getId(xCoord, yCoord);
                let stack = this.getStack(xCoord, yCoord);

                this.takePiece(new Piece(xCoord, yCoord, side, id, stack));

                tookPiece = true;
                this.numMoves++;
            }

            if(xPos == nextPos.xPos && yPos == nextPos.yPos && !legal) {
                if(!tookPiece)
                    this.numMoves++;
                legal = true;
            }
        }

        return {
            legal: legal,
            tookPiece: tookPiece
        }
    }

    euclideanDistance(p1, p2) {

        let xdiff = Math.pow((p1.xPos - p2.xPos), 2);
        let ydiff = Math.pow((p1.yPos - p2.yPos), 2);

        return Math.sqrt(xdiff + ydiff);
    }

    removeFromArray(arr, elem) {
        let idx = -1;

        for(let i = 0; i < arr.length; i++) {
            if(elem.xPos == arr[i].xPos && elem.yPos == arr[i].yPos) {
                idx = i;
            }
        }

        arr.splice(idx, 1);
    }

    posExist(arr, elem) {

        let found = false;

        for(let i = 0; i < arr.length; i++) {
            if(elem.xPos == arr[i].xPos && elem.yPos == arr[i].yPos) {
                found = true;
            }
        }

        return found;
    }

    aStarSearch(src, dest, possMoves) {

        let closedSet = [];
        let openSet = [];

        let boardGrid = [];

        for(let i = 0; i < 8; i++) {
            boardGrid[i] = [];
            for(let j = 0; j < 8; j++) {
                boardGrid[i][j] = new Position(i, j, 'E');
            }
        }

        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                boardGrid[i][j].addNeighbors(boardGrid);
            }
        }

        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                for(let k = 0; k < possMoves.length; k++) {
                    if((possMoves[k].x == boardGrid[i][j].xPos && possMoves[k].y == boardGrid[i][j].yPos) || (possMoves[k].piece != null && possMoves[k].piece.x == boardGrid[i][j].xPos && possMoves[k].piece.y == boardGrid[i][j].yPos)) {
                        boardGrid[i][j].wall = false;
                    }
                }
            }
        }

        let start = boardGrid[src.getPosition().xPos][src.getPosition().yPos];

        let end = boardGrid[dest.xPos][dest.yPos];

        let current = null;

        start.wall = false;
        end.wall = false;

        openSet.push(start);

        while(openSet.length > 0) {

            let winner = 0;

            for(let i = 0; i < openSet.length; i++) {
                if(openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
            }

            current = openSet[winner];

            if(current.xPos == end.xPos && current.yPos == end.yPos) {
                break;
            }

            this.removeFromArray(openSet, current);
            closedSet.push(current);

            let neighbors = current.neighbors;

            for(let i = 0; i < neighbors.length; i++) {

                let neighbor = neighbors[i];

                if(!neighbor.wall && !this.posExist(closedSet, neighbor)) {

                    let tempG = current.g + this.euclideanDistance(neighbor, current);

                    let newPath = false;

                    if(this.posExist(openSet, neighbor)) {
                        if(tempG < neighbor.g) {
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    } else {
                        neighbor.g = tempG;
                        newPath = true;
                        openSet.push(neighbor);
                    }

                    if(newPath) {
                        neighbor.h = this.euclideanDistance(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }
        }

        let path = [];

        let temp = current;
        path.push(temp);
        while(temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }

        let newPossMoves = [];

        for(let i = 0; i < possMoves.length; i++) {
            for(let j = 0; j < path.length; j++) {
                if(possMoves[i].x == path[j].xPos && possMoves[i].y == path[j].yPos) {
                    newPossMoves.push(possMoves[i]);
                }
            }
        }

        return newPossMoves;
    }
 

    doMove(piece, nextPos) {

        let moved = false, remove = null;

        let anotherMove = false;

        let checkersLength = piece.side == this.myColor ? this.otherCheckers.length : this.myCheckers.length;

        let result = this.isMoveLegal(piece, nextPos);

        if(result.legal) {

            let newLength = piece.side == this.myColor ? this.otherCheckers.length : this.myCheckers.length;

            if(newLength == checkersLength && piece.remove == null)
                remove = this.scanBoard(piece, nextPos);

            let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

            if(nextPos.xPos == 0 && newPiece.side == this.myColor && newPiece.stack == 1) 
                newPiece.incrementStack();
            
            if(nextPos.xPos == 7 && newPiece.side == this.otherColor && newPiece.stack == 1) 
                newPiece.incrementStack();

            this.board[nextPos.xPos][nextPos.yPos] = newPiece;
            
            let currPos = piece.getPosition(); 

            this.board[currPos.xPos][currPos.yPos] = null;

            if(result.tookPiece) {

                let possMoves = this.possibleMoves(newPiece, null);

                for(let i = 0; i < possMoves.length; i++) {
                    if(possMoves[i].piece != null) {
                        anotherMove = true;
                        break;
                    }
                }
            }

            moved = true;
        }

        return { move: moved, id: remove, took: anotherMove };
    } 

    scanBoard(piece) {

        let i, j;

        let remove = null;
 
        let allPieces = this.allMovablePieces(piece.side);

        if(allPieces.length > 0) {

            let removePieces = [];

            for(i = 0; i < allPieces.length; i++) {

                if(allPieces[i].id != piece.id) {

                    let moves = this.possibleMoves(allPieces[i], null);

                    if(moves.length > 0) {

                        for(j = 0; j < moves.length; j++) {

                            if(moves[j].piece != null) {
                                removePieces.push(allPieces[i]);
                            }
                        }
                    }
                }
            }

            if(removePieces.length > 0) {

                let index = Math.floor(Math.random() * removePieces.length);

                remove = removePieces[index].id;

                this.takePiece(removePieces[index]);
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

        let empty = false;

        if(this.board[xpos][ypos] == null)
            empty = true;

        return empty;
    }

    getId(i, j) {
        return this.board[i][j].id;
    }

    getSide(i, j) {
        return this.board[i][j].side;
    }

    getStack(i, j) {
        return this.board[i][j].stack;
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

    finishState() {
        
        let winner = null;
        let finished = false;

        let myPieces = this.allMovablePieces(this.myColor);
        let opPieces = this.allMovablePieces(this.otherColor);

        if(this.myCheckers.length < this.otherCheckers.length && this.myCheckers.length == 0) {
            finished = true;
            winner = "Opponent";
        } else if(this.myCheckers.length > this.otherCheckers.length && this.otherCheckers.length == 0)  {
            finished = true;
            winner = "You";
        } else if(myPieces.length == 0) {
            finished = true;
            winner = "Opponent";
        } else if(opPieces.length == 0) {
            finished = true;
            winner = "You";
        } else if(this.myCheckers.length == 1 && this.otherCheckers.length == 1) {
            
            let opPiece = this.getPieceFromId(this.otherCheckers[0]);
            let myPiece = this.getPieceFromId(this.myCheckers[0]);

            let dist = this.euclideanDistance(opPiece.getPosition(), myPiece.getPosition());

            if(dist > 1) {
                finished = true;
                winner = "Draw";
            }
        }

        return {
            winner: winner,
            finished: finished
        }
    }

    computerMove(model) {

        let currPiece, currNextPos, taken = false;

        this.checkAllPieces();

        let state = this.normalizeBoard();

        let output = model.predict(tf.tensor2d([state])).dataSync();

        let newOut = []
        for(let i = 0; i < output.length; i++)
            newOut.push(output[i])

        output = newOut;

        const pred = [];
        while(output.length) pred.push(output.splice(0,8));

        let frst = pred[0].indexOf(Math.max(...pred[0]));
        let scnd = pred[1].indexOf(Math.max(...pred[1]));
        let thrd = pred[2].indexOf(Math.max(...pred[2]));
        let frth = pred[3].indexOf(Math.max(...pred[3]));

        console.log(frst, scnd, thrd, frth);

        try {

            if(this.board[frst][scnd] != null && this.board[frst][scnd].side == this.otherColor) {

                let pieceId = this.getId(frst, scnd);

                let stack = this.getStack(frst, scnd);

                let piece = new Piece(frst, scnd, this.otherColor, pieceId, stack);

                let nextPos = new Position(thrd, frth, 'E');

                currPiece = piece;

                currNextPos = nextPos;

                let res = this.doMove(piece, nextPos);

                taken = res.took;

                if(!res.move) {

                    let move = this.bestMove();

                    console.log(move.piece, move.nextPos);

                    let res = this.doMove(move.piece, move.nextPos);

                    currPiece = move.piece;

                    currNextPos = move.nextPos;

                    taken = res.took;
                }
            } else {

                let move = this.bestMove();

                console.log(move.piece, move.nextPos);

                let res = this.doMove(move.piece, move.nextPos);

                currPiece = move.piece;

                currNextPos = move.nextPos;

                taken = res.took;
            }

        } catch(err) {

            console.log(err.message);

            console.log("Computer Making Move");

            let move = this.bestMove();

            console.log(move.piece, move.nextPos);

            let res = this.doMove(move.piece, move.nextPos);

            currPiece = move.piece;

            currNextPos = move.nextPos;

            taken = res.took;
        }

        return {
            piece: currPiece,
            nextPos: currNextPos,
            took: taken
        }
    }


    bestMove() {

        let piece = null, nextPos = null, move;

        console.log("Trying First");

        move = this.firstPrior();

        if(move.piece == null && move.nextPos == null) {

            console.log("Trying Second");

            move = this.secondPrior();

            if(move.piece == null && move.nextPos == null) {

                console.log("Trying Third");

                move = this.thirdPrior();

                piece = move.piece;
                nextPos = move.nextPos;

            } else {

                piece = move.piece;
                nextPos = move.nextPos;

            }

        } else {

            piece = move.piece;
            nextPos = move.nextPos;

        }

        return {
            piece: piece,
            nextPos: nextPos
        }
    }

    firstPrior() {

        let piece = null, nextPos = null;

        let allPieces = this.allMovablePieces(this.otherColor);

        for(let i = 0; i < allPieces.length; i++) {

            if(piece != null && nextPos != null)
                break;

            let possMoves = this.possibleMoves(allPieces[i], null);

            for(let j = 0; j < possMoves.length; j++) {

                if(possMoves[j].piece != null) {
                    piece = allPieces[i];
                    nextPos = new Position(possMoves[j].x, possMoves[j].y, 'E');
                    break;
                }
            }
        }

        return {
            piece: piece,
            nextPos: nextPos
        }
    }

    secondPrior() {

        let piece = null, nextPos = null;

        let myPieces = this.allMovablePieces(this.myColor);
        let opPieces = this.allMovablePieces(this.otherColor);

        for(let i = 0; i < myPieces.length; i++) {
            for(let j = 0; j < opPieces.length; j++) {

                if(piece != null && nextPos != null)
                    break;

                let opMoves = this.possibleMoves(opPieces[j], null);
                let myMoves = this.possibleMoves(myPieces[i], null);

                for(let x = 0; x < opMoves.length; x++) {
                    for(let y = 0; y < myMoves.length; y++) {
                        if(opMoves[x].x == myMoves[y].x && myMoves[y].y == opMoves[x].y) {
                            if(myMoves[y].piece != null && opMoves[x].piece == null) {
                                piece = opPieces[j];
                                nextPos = new Position(opMoves[x].x, opMoves[x].y, 'E');
                                break;
                            }
                        } 
                    }
                }
            }
        }

        return {
            piece: piece,
            nextPos: nextPos
        }
    }


    thirdPrior() {

        let piece = null, nextPos = null;

        let count = 1;

        while(true) {

            let found = false;

            let allPieces = this.allMovablePieces(this.otherColor);

            if(allPieces.length > 0) {
                let randIndex = Math.floor(Math.random() * allPieces.length);

                piece = allPieces[randIndex];
                let possMoves = this.possibleMoves(piece, null);

                let randMove = Math.floor(Math.random() * possMoves.length);
                nextPos = new Position(possMoves[randMove].x, possMoves[randMove].y, 'E');

                let myPieces = this.allMovablePieces(this.myColor);

                for(let i = 0; i < myPieces.length; i++) {

                    let myMoves = this.possibleMoves(myPieces[i], null);

                    for(let j = 0; j < myMoves.length; j++) {
                        if(myMoves[j].x == nextPos.xPos && myMoves[j].y == nextPos.yPos) 
                            found = true;
                    }
                }
            }

            if(!found || count > allPieces.length || allPieces.length == 0) 
                break

            count++;
        }

        return {
            piece: piece,
            nextPos: nextPos
        }
    }
}