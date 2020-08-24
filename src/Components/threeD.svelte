<script>
    import { onMount } from 'svelte';
    import { gameBoard, gamePref, currSocket, currUser, ratio, gameLevel, gameHistory, gameMoves } from '../Scripts/Init.js';
    import { spring } from 'svelte/motion';
    import { Position } from '../Scripts/Position.js';
    import { Board } from '../Scripts/Board.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { normalizeState, getUserGames } from '../Scripts/Functions.js';
    import env from '../env.json';

    let model;

    let gameOver;
    let showWinner = false;

    let boardSquare;
    let numSquares = 8;

	if($ratio < 1) {
        boardSquare = screen.width;
	} else {
        boardSquare = 0.9 * screen.height;
    }

    let square = boardSquare / numSquares;
    let size = 0.35 * square;

    let cirDim = 0.05 * screen.height;
    
    document.documentElement.style.setProperty('--boardSquare', boardSquare + 'px');
    document.documentElement.style.setProperty('--cirDim', cirDim + 'px');

    let yRotation, currDim, cyHeight; 

    let maxHeight = size / 2;

    if($currUser != null) {
        if($currUser.gamePreferences.orient == 2) {
            yRotation = 0;
            currDim = "3D";
            cyHeight = 0;
        } else {
            yRotation = boardSquare;
            currDim = "2D";
            cyHeight = maxHeight;
        }
    } else {
        yRotation = 0;
        currDim = "3D";
        cyHeight = 0;
    }

    export let currPos; 
    export let nextPos;

    export let numMoves;
    export let rangeMoves;

    let lockedPiece = false;
    let moving = false;
    let checkMove;

    let checkers = [];
    let emptySqs = [];

    let possibleMoves = [];

    let king, piece;

    $currSocket.on('piece-move', (data) => {

		if(data.gameID == $gamePref.gameID && data.oppID == $currUser.profile.email) {

            console.log(data);

			if(data.remove != null)
				$gameBoard.takePiece($gameBoard.getPieceFromId(data.remove));
			
            currPos = $gameBoard.getPiece(data.piece[0], data.piece[1]);

            currPos.remove = data.remove;

            nextPos = new Position(data.nextPos[0], data.nextPos[1], 'E');
            
            gameHistory.update(state => {
                state.push($gameBoard.saveBoardState());
                return state;
            });

            gameMoves.update(state => {
                let xPos = currPos.getPosition().xPos;
                let yPos = currPos.getPosition().yPos;
                state.push([xPos, yPos, nextPos.xPos, nextPos.yPos]);
                return state;
            });

            $gameBoard.doMove(currPos, nextPos);

            gameOver = $gameBoard.finishState();

            gamePref.update(state => {
                state.rangeMoves = $gameBoard.numMoves;
                if(!gameOver.finished) {
                    state.currPlayer = state.currPlayer == 0 ? 1 : 0;
                } else {
                    state.finished = true;
                    state.paused = true;
                }
                return state;
            });

            gameBoard.set($gameBoard);
            
            moving = true;

            if(gameOver.finished) 
                showWinner = true;
		}
	});

    let board = function(p5) {

        p5.setup = function() {
            p5.createCanvas(boardSquare, boardSquare, this.WEBGL);
        }

        p5.preload = function() {
            king = p5.loadModel('images/king.obj');
            piece = p5.loadModel('images/piece.obj');
        }

        p5.draw = function() {
            p5.angleMode(p5.DEGREES);
            p5.background(255);
            p5.camera(0, yRotation, boardSquare, 0, 0, 0, 0, 1, 0);
            p5.translate(-(boardSquare/2 - square/2), -(boardSquare/2 - square/2));

            let topLeftX, topLeftY;
            let topRightX, topRightY;
            let bottomLeftX, bottomLeftY;
            let bottomRightX, bottomRightY;

            let xSquare, ySquare;
            let squareDiv;
            let currX, currY;

            topLeftX = ((p5.width - boardSquare) / 2) + (square / 2);
            topLeftY = ((p5.height - boardSquare) / 2) + (square / 2);

            currX = topLeftX;
            currY = topLeftY;

            topRightX = topLeftX * 15;
            topRightY = topLeftY;

            bottomLeftX = topLeftX;
            bottomLeftY = topLeftY * 15;

            bottomRightX = topLeftX * 15;
            bottomRightY = bottomLeftY;

            if(yRotation >= boardSquare) {

                //console.log("TopLeftX: " + topLeftX + ", TopLeftY: " + topLeftY);

                topLeftX = Math.floor(topLeftX * 4.074);
                topLeftY = Math.floor(topLeftY * 5.092);

                currX = topLeftX;
                currY = topLeftY;

                //console.log("TopLeftX: " + topLeftX + ", TopLeftY: " + topLeftY);
                //console.log("TopRightX: " + topRightX + ", TopRightY: " + topRightY);

                topRightX = Math.floor(topRightX * 0.762);
                topRightY = topLeftY;

                //console.log("TopRightX: " + topRightX + ", TopRightY: " + topRightY);
                //console.log("bottomLeftX: " + bottomLeftX + ", bottomLeftY: " + bottomLeftY);

                bottomLeftX = Math.floor(bottomLeftX * 2.314);
                bottomLeftY = Math.floor(bottomLeftY * 0.782);

                //console.log("bottomLeftX: " + bottomLeftX + ", bottomLeftY: " + bottomLeftY);
                //console.log("bottomRightX: " + bottomRightX + ", bottomRightY: " + bottomRightY);
                
                bottomRightX = topRightX + (topLeftX - bottomLeftX);
                bottomRightY = bottomLeftY;

                //console.log("bottomRightX: " + bottomRightX + ", bottomRightY: " + bottomRightY);

                xSquare = (topRightX - topLeftX) / 7;
                ySquare = (bottomRightY - topRightY) / 7;

                squareDiv = (topLeftX - bottomLeftX) / 7;
            }

            let count = 0;
            
            for(let i = 0; i < numSquares; i++) {
                for(let j = 0; j < numSquares; j++) {
                    let even = (i % 2 == 0) && (j % 2 == 0);
                    let odd = (i % 2 != 0) && (j % 2 != 0);

                    if(even || odd) {
                        p5.fill('wheat');
                        p5.box(square, square, 10);
                    } else {
                        if(possibleMoves.length > 0) {

                            p5.fill('brown');

                            if(!moving) {
                                for(let k = 0; k < possibleMoves.length; k++) {
                                    if(possibleMoves[k].x == i && possibleMoves[k].y == j) {
                                        p5.fill("skyblue");
                                        break;
                                    } 
                                }
                            }
                                
                        } else {
                            p5.fill('brown');
                        }
                        p5.box(square, square, 10);

                        if(!$gameBoard.isEmpty(i, j)) {

                            if(moving && currPos != null && nextPos != null && i == nextPos.xPos && j == nextPos.yPos) {
                                
                                let id = $gameBoard.getId(i, j);

                                let prevXPos = checkers[id].x;
                                let prevYPos = checkers[id].y;

                                let dist = p5.dist(prevXPos, prevYPos, currX, currY);

                                if(prevXPos > currX && prevYPos > currY && dist > 10) {
                                    console.log("MOVING PIECE top left");

                                    p5.push();
                                    p5.noStroke();
                                    if($gameBoard.getStack(i, j) == 1)
                                        p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 1);
                                    else
                                        p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 20);
                                    p5.rotateX(90);
                                    if($ratio < 1)
                                        p5.scale($ratio);
                                    if($gameBoard.getSide(i, j) == "#ffffff") {
                                        p5.directionalLight(0, 255, 255, 0, 0, -1);
                                        p5.directionalLight(0, 255, 255, 0, -1, 0);
                                    } else {
                                        p5.directionalLight(105,105,105, 0, 0, -1);
                                        p5.directionalLight(105,105,105, 0, -1, 0);
                                    }
                                    p5.ambientMaterial(255);
                                    if($gameBoard.getStack(i, j) == 1)
                                        p5.model(piece);
                                    else
                                        p5.model(king);
                                    p5.pop();

                                    checkers[id] = {};
                                    checkers[id].x = prevXPos - 2;
                                    checkers[id].y = prevYPos - 2;
                                    checkers[id].i = i;
                                    checkers[id].j = j;
                                    checkers[id].r = size * 1.5; 
                                } else if(prevXPos > currX && prevYPos < currY && dist > 10) {
                                    console.log("MOVING PIECE bottom left");

                                    p5.push();
                                    p5.noStroke();
                                    if($gameBoard.getStack(i, j) == 1)
                                        p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 1);
                                    else
                                        p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 20);
                                    p5.rotateX(90);
                                    if($ratio < 1)
                                        p5.scale($ratio);
                                    if($gameBoard.getSide(i, j) == "#ffffff") {
                                        p5.directionalLight(0, 255, 255, 0, 0, -1);
                                        p5.directionalLight(0, 255, 255, 0, -1, 0);
                                    } else {
                                        p5.directionalLight(105,105,105, 0, 0, -1);
                                        p5.directionalLight(105,105,105, 0, -1, 0);
                                    }
                                    p5.ambientMaterial(255);
                                    if($gameBoard.getStack(i, j) == 1)
                                        p5.model(piece);
                                    else
                                        p5.model(king);
                                    p5.pop();
                                    
                                    checkers[id] = {};
                                    checkers[id].x = prevXPos - 2;
                                    checkers[id].y = prevYPos + 2;
                                    checkers[id].i = i;
                                    checkers[id].j = j;
                                    checkers[id].r = size * 1.5; 
                                } else if(prevXPos < currX && prevYPos > currY && dist > 10) {
                                    console.log("MOVING PIECE top right");

                                    p5.push();
                                    p5.noStroke();
                                    if($gameBoard.getStack(i, j) == 1)
                                        p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 1);
                                    else
                                        p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 20);
                                    p5.rotateX(90);
                                    if($ratio < 1)
                                        p5.scale($ratio);
                                    if($gameBoard.getSide(i, j) == "#ffffff") {
                                        p5.directionalLight(0, 255, 255, 0, 0, -1);
                                        p5.directionalLight(0, 255, 255, 0, -1, 0);
                                    } else {
                                        p5.directionalLight(105,105,105, 0, 0, -1);
                                        p5.directionalLight(105,105,105, 0, -1, 0);
                                    }
                                    p5.ambientMaterial(255);
                                    if($gameBoard.getStack(i, j) == 1)
                                        p5.model(piece);
                                    else
                                        p5.model(king);
                                    p5.pop();

                                    checkers[id] = {};
                                    checkers[id].x = prevXPos + 2;
                                    checkers[id].y = prevYPos - 2;
                                    checkers[id].i = i;
                                    checkers[id].j = j;
                                    checkers[id].r = size * 1.5; 
                                } else if(prevXPos < currX && prevYPos < currY && dist > 10) {
                                    console.log("MOVING PIECE bottom right");

                                    p5.push();
                                    p5.noStroke();
                                    if($gameBoard.getStack(i, j) == 1)
                                        p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 1);
                                    else
                                        p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 20);
                                    p5.rotateX(90);
                                    if($ratio < 1)
                                        p5.scale($ratio);
                                    if($gameBoard.getSide(i, j) == "#ffffff") {
                                        p5.directionalLight(0, 255, 255, 0, 0, -1);
                                        p5.directionalLight(0, 255, 255, 0, -1, 0);
                                    } else {
                                        p5.directionalLight(105,105,105, 0, 0, -1);
                                        p5.directionalLight(105,105,105, 0, -1, 0);
                                    }
                                    p5.ambientMaterial(255);
                                    if($gameBoard.getStack(i, j) == 1)
                                        p5.model(piece);
                                    else
                                        p5.model(king);
                                    p5.pop();

                                    checkers[id] = {};
                                    checkers[id].x = prevXPos + 2;
                                    checkers[id].y = prevYPos + 2;
                                    checkers[id].i = i;
                                    checkers[id].j = j;
                                    checkers[id].r = size * 1.5;
                                } else {
                                    console.log("STOP moving");
                                    moving = false;
                                }
                            } else {
                                let xCurrPos;
                                let yCurrPos;

                                if(currPos != null) {
                                    xCurrPos = currPos.getPosition().xPos;
                                    yCurrPos = currPos.getPosition().yPos;
                                }

                                p5.push();
                                p5.noStroke();
                                if($gameBoard.getStack(i, j) == 1)
                                    p5.translate(0, 0, maxHeight + 1);
                                else
                                    p5.translate(0, 0, maxHeight + 20);
                                p5.rotateX(90);
                                if($ratio < 1)
                                    p5.scale($ratio);
                                if(currPos != null && i == xCurrPos && j == yCurrPos) {
                                    p5.directionalLight(0, 255, 255, 0, 0, -1);
                                    p5.directionalLight(0, 255, 255, 0, -1, 0);
                                } else {
                                    if($gameBoard.getSide(i, j) == "#ffffff") {
                                        p5.directionalLight(255, 255, 255, 0, 0, -1);
                                        p5.directionalLight(255, 255, 255, 0, -1, 0);
                                    } else {
                                        p5.directionalLight(105,105,105, 0, 0, -1);
                                        p5.directionalLight(105,105,105, 0, -1, 0);
                                    }
                                }
                                p5.ambientMaterial(255);
                                if($gameBoard.getStack(i, j) == 1)
                                    p5.model(piece);
                                else
                                    p5.model(king);
                                p5.pop();

                                let id = $gameBoard.getId(i, j);

                                checkers[id] = {};
                                checkers[id].x = currX;
                                checkers[id].y = currY;
                                checkers[id].i = i;
                                checkers[id].j = j;
                                checkers[id].r = size * 1.5; 
                            }
                        } else {
                            emptySqs[count] = {};
                            emptySqs[count].x = currX;
                            emptySqs[count].y = currY;
                            emptySqs[count].i = i;
                            emptySqs[count].j = j;
                            emptySqs[count].r = size * 1.5;
                            count++;
                        }
                    }
                    p5.translate(square, 0);

                    if(yRotation < boardSquare)
                        currX += square;
                    else
                        currX += xSquare;
                }
                
                if(yRotation < boardSquare) {
                    currX = topLeftX;
                    currY += square;
                } else {
                    topLeftX -= squareDiv;
                    topRightX += squareDiv;

                    xSquare = (topRightX - topLeftX) / 7;

                    currX = topLeftX;
                    currY += ySquare;
                }

                p5.translate(-(square * 8), square);
            }
        }

        p5.mousePressed = function() {

            //console.log(this.mouseX + ", " + this.mouseY);

            //console.log(checkers);

            for(let i = 0; i < emptySqs.length; i++) {

                let dist = p5.dist(this.mouseX, this.mouseY, emptySqs[i].x, emptySqs[i].y);

                if($gamePref != null) {

                    if(dist < emptySqs[i].r && $gameBoard.isEmpty(emptySqs[i].i, emptySqs[i].j) && currPos != null && $gamePref.rangeMoves == $gameBoard.numMoves && $gamePref.currPlayer == $gamePref.side && !$gamePref.finished) {

                        console.log("Empty Square at: " + emptySqs[i].i + ", " + emptySqs[i].j);

                        nextPos = new Position(emptySqs[i].i, emptySqs[i].j, 'E');

                        gameHistory.update(state => {
                            state.push($gameBoard.saveBoardState());
                            return state;
                        });

                        let res = $gameBoard.doMove(currPos, nextPos);

                        gameOver = $gameBoard.finishState();

                        console.log(res.move);

                        gameBoard.set($gameBoard);

                        let pieceInfo = null

                        if(res.move) {

                            gameMoves.update(state => {
                                let xPos = currPos.getPosition().xPos;
                                let yPos = currPos.getPosition().yPos;
                                state.push([xPos, yPos, nextPos.xPos, nextPos.yPos]);
                                return state;
                            });

                            moving = true;

                            gamePref.update(state => {
                                state.rangeMoves = $gameBoard.numMoves;
                                if(!gameOver.finished) {
                                    state.currPlayer = state.currPlayer == 0 ? 1 : 0;
                                } else {
                                    state.finished = true;
                                    state.paused = true;
                                }
                                state.myMoves += 1;
                                state.timer = state.time;
                                return state;
                            });
                            
                            pieceInfo = {
                                piece: [7 - currPos.getPosition().xPos, 7 - currPos.getPosition().yPos],
                                nextPos: [7 - nextPos.xPos, 7 - nextPos.yPos],
                                remove : res.id,
                                gameID: $gamePref.gameID,
                                oppID: $gamePref.oppID
                            }

                            currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos);
                            possibleMoves = [];

                            $currSocket.emit('piece-move', pieceInfo);
                        }

                        if(gameOver.finished)
                            showWinner = true;

                        break;
                    } 
                } else {
                    if(dist < emptySqs[i].r && $gameBoard.isEmpty(emptySqs[i].i, emptySqs[i].j) && currPos != null) {

                        console.log("Empty Square at: " + emptySqs[i].i + ", " + emptySqs[i].j);

                        nextPos = new Position(emptySqs[i].i, emptySqs[i].j, 'E');

                        gameHistory.update(state => {
                            state.push($gameBoard.saveBoardState());
                            return state;
                        }); 

                        let res = $gameBoard.doMove(currPos, nextPos);

                        if(res.move) {
                            gameMoves.update(state => {
                                let xPos = currPos.getPosition().xPos;
                                let yPos = currPos.getPosition().yPos;
                                state.push([xPos, yPos, nextPos.xPos, nextPos.yPos]);
                                return state;
                            });
                        }

                        gameOver = $gameBoard.finishState();

                        console.log(res.move);

                        gameBoard.set($gameBoard);

                        if(res.move && !gameOver.finished) {

                            moving = true;

                            currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos);

                            possibleMoves = [];

                            checkMove = setInterval(computerMove, 1000);
                        }
                        
                        if(gameOver.finished)
                            showWinner = true;

                        break;
                    } 
                }
            }

            for(let i = 0; i < checkers.length; i++) {
                //console.log(i + ": " + state[i].x + ", " + state[i].y);
                let dist = p5.dist(this.mouseX, this.mouseY, checkers[i].x, checkers[i].y);
                //console.log(dist);
                let xPos = checkers[i].i;
                let yPos = checkers[i].j;

                if($gamePref != null) {
                    if(dist < checkers[i].r && !$gameBoard.isEmpty(xPos, yPos) && $gameBoard.myCheckers.indexOf(i) != -1 && $gamePref.currPlayer == $gamePref.side && $gamePref.rangeMoves == $gameBoard.numMoves && !$gamePref.finished && !$gamePref.paused) {
                        console.log("Clicked Checker at: " + xPos + ", " + yPos);
                        currPos = $gameBoard.getPieceFromId(i);
                        possibleMoves = $gameBoard.possibleMoves(currPos, null);
                        break;
                    }
                } else {
                    if(dist < checkers[i].r && !$gameBoard.isEmpty(xPos, yPos) && $gameBoard.getSide(xPos, yPos) == "#ffffff" && $gameBoard.myCheckers.indexOf(i) != -1 && rangeMoves == numMoves) {
                        console.log("Clicked Checker at: " + xPos + ", " + yPos);;
                        currPos = $gameBoard.getPieceFromId(i);
                        possibleMoves = $gameBoard.possibleMoves(currPos, null);
                        break;
                    }
                }
            }
        }
    }

    function computerMove() {

        if(!moving) {

            clearInterval(checkMove);

            let mover = $gameBoard.computerMove(model);

            currPos = mover.piece;
            nextPos = mover.nextPos;
        
            moving = true;

            gameBoard.set($gameBoard);

            gameOver = $gameBoard.finishState();

            if(gameOver.finished)
                showWinner = true;

            if(mover.took) {
                checkMove = setInterval(computerMove, 1000);
            }
        }
    } 

    function changeDimension() {

        let step = maxHeight / (boardSquare / 25);
        let turn;

        if(yRotation == 0) {
            currDim = "2D";
            turn = setInterval(function() {
                if(yRotation < boardSquare) {
                    yRotation += 25;
                    cyHeight += step;
                } else {
                    clearInterval(turn);
                }
            }, 100);
        } else if(yRotation >= boardSquare) {
            currDim = "3D";
            turn = setInterval(function() {
                if(yRotation > 0) {
                    yRotation -= 25;
                    cyHeight -= step;
                } else {
                    clearInterval(turn);
                }
            }, 100);
        }
    }

    async function resetGame() {

        showWinner = false;

        if(gameOver.winner == "You") {

            let fullGame = [];

            for(let i = 0; i < $gameHistory.length; i++) {
                let { state, pieceId } = normalizeState($gameHistory[i]);
                fullGame.push({ board: state, move: $gameMoves[i] });
            }

            if(navigator.onLine) {

                let request = {
                    func: "saveTrainData",
                    fullGame: fullGame,
                    id: $currUser != null ? $currUser.profile.email : null
                }

                $currSocket.emit('save-game', request);
            } else {
                let allOffGames = await JSON.parse(localStorage.getitem('offGames'));

                allGames.push(fullGame);

                await localStorage.setItem('offGames', JSON.stringify(allGames));
            }
        }

        if($gamePref != null) {

            if(gameOver.winner == "You") {

                let gameState = []

                for(let i = 0; i < $gameHistory.length; i++) {
                    let { state, pieceId } = normalizeState($gameHistory[i]);
                    gameState.push({ board: state, move: $gameMoves[i], gameIds: pieceId });
                }

                let request = {
                    func: "finishGame",
                    gameID: $gamePref.gameID,
                    initiator: $gamePref.initiator,
                    gameHistory: gameState,
                    myMoves: $gamePref.myMoves,
                    winner: $currUser.profile.name,
                    minutes: Math.ceil($gamePref.secondsPlayed / 60),
                    id: $currUser.profile.email
                }

                $currSocket.emit('save-game', request);

                gamePref.set(null);

            } else {

                let request = {
                    func: "finishGame",
                    gameID: $gamePref.gameID,
                    gameHistory: null,
                    initiator: $gamePref.initiator,
                    myMoves: $gamePref.myMoves,
                    id: $currUser.profile.email
                }

                $currSocket.emit('save-game', request);

                gamePref.set(null);
            }
        }

        if($gamePref == null && $currUser != null && $currUser.isAuth) {
            currUser.update(state => {
                state.lastGame = [];
                return state;
            });
        }

        setTimeout(function() {
            possibleMoves = [];
            currPos = null;
            nextPos = null;
            gameMoves.set([]);
            gameBoard.set(new Board(null, false));
            gameHistory.set([]);
        }, 1000);
    }

    onMount(async function() {
        let myp5 = new p5(board, "board");

        try {
            model = await tf.loadLayersModel('localstorage://checkas-model');
        } catch(err) {
            let url = window.location.hostname.includes('localhost') ? env.local : env.server;

            switch($gameLevel) {
                case 1:
                    model = await tf.loadLayersModel(url + 'v1/model.json');
                    await model.save('localstorage://checkas-model');
                    break;
                default:
                    model = await tf.loadLayersModel(url + 'v3/model.json');
                    await model.save('localstorage://checkas-model');
            }
        }
    });
</script>

{#if $gamePref != null}
    <h4 class="players comp"><span class="lefty">{$gamePref.opp != null ? $gamePref.opp : "Waiting for Other Player"}</span> <span class="mid">0:00</span> <span class="righty">{12 - $gameBoard.myCheckers.length}</span></h4>
    <h4 class="players me"><span class="lefty">{$currUser.profile.name}</span> <span class="mid">0:00</span> <span class="righty">{12 - $gameBoard.otherCheckers.length}</span></h4>
{:else}
    <h4 class="players comp"><span class="lefty"><i class="fa fa-circle"></i> Computer</span> <span class="mid">{12 - $gameBoard.myCheckers.length} <i class="fa fa-circle white"></i></span></h4>
    <h4 class="players me"><span class="lefty"><i class="fa fa-circle white"></i> {$currUser != null ? $currUser.profile.name : "Guest"}</span> <span class="mid">{12 - $gameBoard.otherCheckers.length} <i class="fa fa-circle"></i></span></h4>
{/if}

{#if $ratio > 1}
    <button class="btn btn-primary btn-sm" on:click="{changeDimension}">{currDim}</button>
{/if}

<div id="board"></div>

{#if showWinner}
    <div id="winner">
        {#if gameOver.winner != "Draw"}
            {#if $gamePref != null}
                {#if gameOver.winner != "You"}
                    <h2>{$gamePref.opp} Won The Game!</h2>
                {:else}
                    <h2>{gameOver.winner} Won The Game!</h2>
                {/if}
            {:else}
                <h2>{gameOver.winner} Won The Game!</h2>
            {/if}
        {:else}
            <h2>It's a Draw!</h2>
        {/if}

        {#if $gamePref != null}
            <button id="again" class="btn btn-primary" on:click="{resetGame}">End Game</button>
        {:else}
            <button id="again" class="btn btn-primary" on:click="{resetGame}">Play Again</button>
        {/if}
    </div>
{/if}

<style>
    .players {
        width:50%;
		left:25%;
		position:fixed;
		z-index:1;
		background-color:skyblue;
	}

    .comp {
        top:4.5%;
    }

    .me {
        bottom:3.5%;
    }

    .lefty {
        margin-left:1%;
        float:left;
    }

    .mid {
        float:right;
        margin-right:1%;
    }

    .righty {
        float:right;
        margin-right:42.5%;
        margin-left:17.5%;
    }

    h2 {
        text-align:center;
        margin-top:33.33%;
        margin-bottom:25%;
        color:white;
    }

    #again {
        width:50%;
        margin-left:25%;
    }

    #winner {
        width:calc(var(--boardSquare) / 2);
        height:calc(var(--boardSquare) / 2);
        background-color: #343a40;
        z-index:99; 
        border-radius:0.4rem;
        top:calc((100% - (var(--boardSquare) / 2)) / 2);
        left:calc((100% - (var(--boardSquare) / 2)) / 2);
        position:fixed;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    #board {
        width:var(--boardSquare);
        height:var(--boardSquare);
		top:calc((100% - var(--boardSquare))/2);
		position:fixed;
		left:calc((100% - var(--boardSquare))/2);
    }

    .btn-sm {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        top:0;
        right:25%;
        z-index:1;
        position:fixed;
    }

    .white {
        color:white;
    }

    @media screen and (max-width: 800px) {

        .comp {
            top:unset;
            margin-top:6.5%;
        }
        
        .players {
            left:unset;
            top:unset;
            bottom:unset;
            width:88%;
            margin-left:20px;
        }

        .me {
            bottom:43%;
        }

        #board {
            width:100%;
            position:unset;
            margin-left:-5px;
            height:unset;
        }

        #winner {
            width:80%;
            left:10%;
            top:15%;
            height:40%;
        }
    }
</style>