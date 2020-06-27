<script>
    import { onMount } from 'svelte';
    import { gameBoard, gamePref, currSocket, currUser, ratio, gameLevel } from '../Scripts/Init.js';
    import { spring } from 'svelte/motion';
    import { Position } from '../Scripts/Position.js';

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
        if($currUser.gamePref.orient == 2) {
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

    let lockedPiece = false;
    let moving = false;

    let checkers = [];
    let emptySqs = [];

    let possibleMoves = [];

    let board = function(p5) {

        p5.setup = function() {
            p5.createCanvas(boardSquare, boardSquare, this.WEBGL);
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

                                if(prevXPos > currX && prevYPos > currY) {
                                    console.log("MOVING PIECE top left");
                                    p5.push();
                                    p5.translate(prevXPos - currX, prevYPos - currY);
                                    p5.rotateX(90);
                                    if($gameBoard.getSide(i, j) == "#000000")
                                        p5.stroke(255);
                                    p5.fill("gold");
                                    p5.cylinder(size, cyHeight);
                                    p5.pop();

                                    p5.push();
                                    p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 1);
                                    p5.strokeWeight(2);
                                    if($gameBoard.getSide(i, j) == "#000000") {
                                        p5.stroke("white");
                                    } else {
                                        p5.stroke("#000000");
                                    }
                                    p5.fill("gold");
                                    p5.circle(0, 0, size * 2);
                                    p5.pop();

                                    checkers[id] = {};
                                    checkers[id].x = prevXPos - 2;
                                    checkers[id].y = prevYPos - 2;
                                    checkers[id].i = i;
                                    checkers[id].j = j;
                                    checkers[id].r = size * 1.5; 
                                } else if(prevXPos > currX && prevYPos < currY) {
                                    console.log("MOVING PIECE bottom left");
                                    p5.push();
                                    p5.translate(currX - prevXPos, currY - prevYPos);
                                    p5.rotateX(90);
                                    if($gameBoard.getSide(i, j) == "#000000")
                                        p5.stroke(255);
                                    p5.fill("gold");
                                    p5.cylinder(size, cyHeight);
                                    p5.pop();

                                    p5.push();
                                    p5.translate(currX - prevXPos, currY - prevYPos, maxHeight + 1);
                                    p5.strokeWeight(2);
                                    if($gameBoard.getSide(i, j) == "#000000") {
                                        p5.stroke("white");
                                    } else {
                                        p5.stroke("#000000");
                                    }
                                    p5.fill("gold");
                                    p5.circle(0, 0, size * 2);
                                    p5.pop();

                                    checkers[id] = {};
                                    checkers[id].x = prevXPos - 2;
                                    checkers[id].y = prevYPos + 2;
                                    checkers[id].i = i;
                                    checkers[id].j = j;
                                    checkers[id].r = size * 1.5; 
                                } else if(prevXPos < currX && prevYPos > currY) {
                                    console.log("MOVING PIECE top right");
                                    p5.push();
                                    p5.translate(prevXPos - currX, prevYPos - currY);
                                    p5.rotateX(90);
                                    if($gameBoard.getSide(i, j) == "#000000")
                                        p5.stroke(255);
                                    p5.fill("gold");
                                    p5.cylinder(size, cyHeight);
                                    p5.pop();

                                    p5.push();
                                    p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 1);
                                    p5.strokeWeight(2);
                                    if($gameBoard.getSide(i, j) == "#000000") {
                                        p5.stroke("white");
                                    } else {
                                        p5.stroke("#000000");
                                    }
                                    p5.fill("gold");
                                    p5.circle(0, 0, size * 2);
                                    p5.pop();

                                    checkers[id] = {};
                                    checkers[id].x = prevXPos + 2;
                                    checkers[id].y = prevYPos - 2;
                                    checkers[id].i = i;
                                    checkers[id].j = j;
                                    checkers[id].r = size * 1.5; 
                                } else if(prevXPos < currX && prevYPos < currY) {
                                    console.log("MOVING PIECE bottom right");
                                    p5.push();
                                    p5.translate(currX - prevXPos, currY - prevYPos);
                                    p5.rotateX(90);
                                    if($gameBoard.getSide(i, j) == "#000000")
                                        p5.stroke(255);
                                    p5.fill("gold");
                                    p5.cylinder(size, cyHeight);
                                    p5.pop();

                                    p5.push();
                                    p5.translate(currX - prevXPos, currY - prevYPos, maxHeight + 1);
                                    p5.strokeWeight(2);
                                    if($gameBoard.getSide(i, j) == "#000000") {
                                        p5.stroke("white");
                                    } else {
                                        p5.stroke("#000000");
                                    }
                                    p5.fill("gold");
                                    p5.circle(0, 0, size * 2);
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
                                p5.rotateX(90);
                                if($gameBoard.getSide(i, j) == "#000000")
                                    p5.stroke(255);
                                if(currPos != null && i == xCurrPos && j == yCurrPos)
                                    p5.fill("gold");
                                else
                                    p5.fill($gameBoard.getSide(i, j));
                                p5.cylinder(size, cyHeight);
                                p5.pop();
                                
                                p5.push();
                                p5.translate(0, 0, maxHeight + 1);
                                p5.strokeWeight(2);
                                if($gameBoard.getSide(i, j) == "#000000") {
                                    p5.stroke("white");
                                } else {
                                    p5.stroke("#000000");
                                }
                                if(currPos != null && i == xCurrPos && j == yCurrPos)
                                    p5.fill("gold");
                                else
                                    p5.fill($gameBoard.getSide(i, j));
                                p5.circle(0, 0, size * 2);
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

                    if(dist < emptySqs[i].r && $gameBoard.isEmpty(emptySqs[i].i, emptySqs[i].j) && currPos != null && $gamePref.rangeMoves == $gamePref.numMoves && $gamePref.currPlayer == $gamePref.side) {

                        console.log("Empty Square at: " + emptySqs[i].i + ", " + emptySqs[i].j);

                        nextPos = new Position(emptySqs[i].i, emptySqs[i].j, 'E');

                        let res = $gameBoard.doMove(currPos, nextPos);

                        console.log(res.move);

                        gameBoard.set($gameBoard);

                        if(res.move) {

                            moving = true;

                            gamePref.update(state => {
                                state.numMoves += 1;
                                state.rangeMoves += 1;
                                state.myMoves += 1;
                                return state;
                            });
                            
                            let pieceInfo = {
                                id : $gameBoard.getId(emptySqs[i].i, emptySqs[i].j),
                                xDiff: currPos.getPosition().xPos - nextPos.xPos,
                                yDiff: currPos.getPosition().yPos - nextPos.yPos,
                                remove : res.id,
                                gameID: $gamePref.gameID,
                                oppID: $gamePref.oppID
                            }

                            $currSocket.emit('piece-move', pieceInfo);
                            
                            $gamePref.states.push($gameBoard.saveBoardState());

                            currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos);

                            possibleMoves = $gameBoard.possibleMoves(currPos);

                            console.log(possibleMoves);
                        }

                        break;
                    } 
                } else {
                    if(dist < emptySqs[i].r && $gameBoard.isEmpty(emptySqs[i].i, emptySqs[i].j) && currPos != null) {

                        console.log("Empty Square at: " + emptySqs[i].i + ", " + emptySqs[i].j);

                        nextPos = new Position(emptySqs[i].i, emptySqs[i].j, 'E');

                        let res = $gameBoard.doMove(currPos, nextPos);

                        console.log(res.move);

                        gameBoard.set($gameBoard);

                        if(res.move) {

                            moving = true;

                            console.log(possibleMoves);

                            let timeMove = Math.floor(Math.random() * (0.75 * 15)) + (0.25 * 15);

                            console.log(timeMove);

                            currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos);
                            possibleMoves = $gameBoard.possibleMoves(currPos);

                            let index = $gameBoard.myCheckers.indexOf(currPos.id);

                            setTimeout(function() {
                                switch($gameLevel) {
                                    case 1:
                                        $gameBoard.medMove();
                                        break;
                                    case 2:
                                        $gameBoard.hardMove();
                                        break;
                                    case 3:
                                        $gameBoard.classMove();
                                        break;
                                    default:
                                        $gameBoard.medMove();
                                }

                                gameBoard.set($gameBoard);

                                if(currPos != null && currPos.id == $gameBoard.myCheckers[index]) {
                                    console.log("Match");
                                    possibleMoves = $gameBoard.possibleMoves(currPos);
                                } else {
                                    console.log("No Match");
                                    currPos = null;
                                    nextPos = null;
                                    possibleMoves = [];
                                }

                            }, timeMove * 1000);
                        }

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
                    if(dist < checkers[i].r && !$gameBoard.isEmpty(xPos, yPos) && $gameBoard.myCheckers.indexOf(i) != -1 && $gamePref.currPlayer == $gamePref.side && $gamePref.rangeMoves == $gamePref.numMoves && !$gamePref.paused) {
                        console.log("Clicked Checker at: " + xPos + ", " + yPos);
                        currPos = $gameBoard.getPieceFromId(i);
                        possibleMoves = $gameBoard.possibleMoves(currPos);
                        break;
                    }
                } else {
                    if(dist < checkers[i].r && !$gameBoard.isEmpty(xPos, yPos) && $gameBoard.getSide(xPos, yPos) == "#ffffff" && $gameBoard.myCheckers.indexOf(i) != -1) {
                        console.log("Clicked Checker at: " + xPos + ", " + yPos);;
                        currPos = $gameBoard.getPieceFromId(i);
                        possibleMoves = $gameBoard.possibleMoves(currPos);
                        break;
                    }
                }
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

    onMount(function() {
        let myp5 = new p5(board, "board");
    });
</script>

<div id="white" class="circle-count">
    <h3>{12 - $gameBoard.myCheckers.length}</h3>
</div>
<button class="btn btn-primary btn-sm" on:click="{changeDimension}">{currDim}</button>
<div id="board"></div>
<div id="black" class="circle-count">
    <h3>{12 - $gameBoard.otherCheckers.length}</h3>
</div>

<style>
    #board {
        width:var(--boardSquare);
        height:var(--boardSquare);
		top:calc((100% - var(--boardSquare))/2);
		position:fixed;
		left:calc((100% - var(--boardSquare))/2);
    }

    .btn-sm {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        top:10px;
        right:25%;
        z-index:1;
        position:fixed;
    }

    h3 {
        text-align:center;
        margin-top:15%;
    }

    .circle-count {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        height:var(--cirDim);
        width:var(--cirDim);
        position:fixed;
        z-index:1;
        border-radius:50%;
    }

    #white {
        left:25%;
        top:10px;
        background:white;
    }

    #black {
        right:25%;
        bottom:10px;
        background:black;
        color:white;
    }

    @media screen and (max-width: 800px) {
        #board {
            width:100%;
            position:unset;
            margin-left:-5px;
            height:unset;
        }

        .btn-sm {
            position:unset;
            margin-top:10px;
        }
    }
</style>