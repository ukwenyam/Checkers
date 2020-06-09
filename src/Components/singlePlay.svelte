<script>
	import { Position } from '../Scripts/Position.js';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { invokeFunction } from '../Scripts/Cloud.js';
	import { fly, fade } from 'svelte/transition';
	import Blur from './blurScreen.svelte';
    import { gameBoard, gameHistory, gamePref, currSocket, currUser, page } from '../Scripts/Init.js';

    gameBoard.set(new Board(null, false));

    let currPlayer = "red";

    let clockTime = 60, timer = 60, time = 60;

    let numMoves = 0, rangeMoves = 0, lastNumMoves = 0;

    let side = "red";

    let paused = true;
	    
	let currPos = null, nextPos = null;

	let lockedPiece = false, finished = false;

    let screenWidth = screen.width, remWidth;

	let size;

	const cirPos = spring([]);

	let squares = [0, 1, 2, 3, 4, 5, 6, 7];

	let squareSize, boardHeight, factor, btnWidth;

	if(screen.width <= 800) {
		factor = 800 / (screen.width - 12.5); 
		squareSize = Math.floor((screen.width - 10) / 8);

		if(screen.width >= 500)
			size = spring(25);
		else
			size = spring(12.5);

		boardHeight = squareSize * 8;
		remWidth = screen.width;
	} else {
		if(screen.height >= 800) {
			factor = 1;
			size = spring(30);
			squareSize = 100;
		} else {
			squareSize = 10 * Math.floor(screen.height / 100);
			factor = 1000 / (squareSize * 10);
			size = spring(25);
        }
		
		boardHeight = squareSize * 8;
        remWidth = 0.8 * (screen.width - 800);
        btnWidth = (0.2 * (screen.width - 800)) - 40;
	}

	document.documentElement.style.setProperty('--chat-width', remWidth + 'px');

    document.documentElement.style.setProperty('--board-height', boardHeight + 'px');
    
    document.documentElement.style.setProperty('--btn-width', btnWidth + 'px');

	setCirclePositions();

	let timeInterval = setInterval(countDown, 1000);

	function countDown() {

		if(currPos != null)
			highlightCircle(currPos);

		if(rangeMoves == numMoves && paused == false) {

			//console.log($gamePref.timer);

			if(timer > 0) {

                timer--;

			} else {
                clearInterval(timeInterval);
                
                currPlayer = currPlayer == "red" ? "black" : "red";

                timer = clockTime;

				currPos = null, nextPos = null;
				lockedPiece = false;

				timeInterval = setInterval(countDown, 1000);
			}
		}
	}
	
	function updateCirclePositions(nextPos) {

		let i = nextPos.xPos, j = nextPos.yPos;

		let id = $gameBoard.getId(i, j);

		cirPos.update(state => {
			state[id].x = (i + i + 1) * (50 / factor);  
			state[id].y = (j + j + 1) * (50 / factor); 
			return state;
		});
	}

	function setCirclePositions() {

		for(let i = 0; i < 8; i++) {
			
			for(let j = 0; j < 8; j++) {

				if(!$gameBoard.isEmpty(i, j)) {

					let id = $gameBoard.getId(i, j);

					cirPos.update(state => {
						state[id] = {};
						state[id].x = (i + i + 1) * (50 / factor);  
                        state[id].y = (j + j + 1) * (50 / factor); 
						return state; 
					});
				} 
			}
		} 
	}

	function setCurrPos(i, j, evt) {

		console.log(i + ", " + j);

		if(currPlayer == side && lockedPiece == false && rangeMoves == numMoves && paused == false) {

			let litCircle = document.getElementById($gameBoard.getId(i,j));

			let allCircles, index;

			if($gameBoard.getSide(i,j) == "black") {
				allCircles = document.getElementsByClassName("black");

				for (index = 0; index < allCircles.length; ++index) 
					allCircles[index].setAttribute("style", "fill:black");
				
				litCircle.setAttribute("style", "fill:grey");
            }
            
			if($gameBoard.getSide(i,j) == "red") {
				allCircles = document.getElementsByClassName("red");

				for (index = 0; index < allCircles.length; ++index) 
					allCircles[index].setAttribute("style", "fill:red");

				litCircle.setAttribute("style", "fill:pink");
			}

			let newtarget = evt.target || event.target;
			let topmost = document.getElementById("use");
			topmost.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href","#" + newtarget.id);
			currPos = $gameBoard.getPiece(i, j);
		}
			
		//let pos = currPos.getPosition();

		//console.log(pos.xPos + ", " + pos.yPos);
	}

	function setNextPos(i, j) {

        console.log(i + ", " + j);
		
		if($gameBoard.isEmpty(i, j) && currPos != null && rangeMoves == numMoves) {

			nextPos = new Position(i, j, 'E');

            let res = $gameBoard.doMove(currPos, nextPos);

            console.log(res.move);

			gameBoard.set($gameBoard);

			console.log($gameBoard);

			if(res.move) {

                numMoves += 1;
                rangeMoves += 1;

                lockedPiece = true;

				updateCirclePositions(nextPos);
                
                $gameHistory.push($gameBoard.saveBoardState());

				currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos);
			}
		}
	}

	function viewBoardHistory() {

		gameBoard.set(new Board($gameHistory[$gamePref.rangeMoves], null));

		setCirclePositions();
	}

	function highlightCircle(currPos) {

        let i = currPos.getPosition().xPos, j = currPos.getPosition().yPos;

        let litCircle = document.getElementById($gameBoard.getId(i, j));

        if($gameBoard.getSide(i,j) == "black") 
            litCircle.setAttribute("style", "fill:grey");
            
        if($gameBoard.getSide(i,j) == "red")
            litCircle.setAttribute("style", "fill:pink");
	}

	function switchPlayer() {

        if(side == currPlayer) {

			clearInterval(timeInterval);

            let allCircles, index;

            if(currPlayer == "black") {

                allCircles = document.getElementsByClassName("black");

                for (index = 0; index < allCircles.length; ++index) 
                    allCircles[index].setAttribute("style", "fill:black");
            } 
            
            if(currPlayer == "red") {

                allCircles = document.getElementsByClassName("red");

                for (index = 0; index < allCircles.length; ++index) 
                    allCircles[index].setAttribute("style", "fill:red");
            }
            
            currPlayer = currPlayer == "red" ? "black" : "red";

            timer = clockTime;

            currPos = null, nextPos = null;
			lockedPiece = false;
			
			timeInterval = setInterval(countDown, 1000);
        }
    }
    
    function startGame() {

        if(side == currPlayer) {

            paused = !paused;
        }
	}

    setInterval(function(){
        if(numMoves > lastNumMoves) {
			saveGame(true);
			lastNumMoves = numMoves;
		}
    }, 300000);

    function saveGame(auto) {

        if(side == currPlayer && numMoves > 0) {

			clearInterval(timeInterval);
        }
    }
</script>

<div id="gameStatus">
	<h2 id="player">Playing: <i class="fa fa-circle" style="color:{currPlayer};"></i></h2>

	<h2 id="moves">Moves: {numMoves}</h2>

	<h2 id="time">Timer: {time}</h2>
</div>

<h4 id="comp" class="players" style="top:0;%">Computer</h4>

<div id="board">
	<svg id="hover">
		{#each squares as i}
			{#each squares as j}
				{#if !$gameBoard.isEmpty(i, j)}
					<rect width="{squareSize}" height="{squareSize}" style="fill:brown;" x="{j * squareSize}" y="{i * squareSize}"/>
					<circle class="{$gameBoard.getSide(i, j)}" id="{$gameBoard.getId(i, j)}" on:click="{() => setCurrPos(i, j, event)}" cx="{$cirPos[$gameBoard.getId(i, j)].y}" cy="{$cirPos[$gameBoard.getId(i, j)].x}" r="{$size}" stroke="white" stroke-width="{$gameBoard.getPiece(i,j).stack * 2}" fill="{$gameBoard.getSide(i, j)}" />
				{:else if $gameBoard.isEmpty(i, j)}
                    {#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}
                        <rect on:click="{() => setNextPos(i, j)}" width="{squareSize}" height="{squareSize}" style="fill:brown;" x="{j * squareSize}" y="{i * squareSize}"/>
                    {/if}
				{/if}
			{/each}
		{/each}
		<use id="use" xlink:href="#24" />
	<svg>
</div>

<h4 id="me" class="players" style="bottom:0;">{$currUser != null ? $currUser.name : "ME"}</h4>

<div id="gameBtn" class="container">
    {#if paused}
        <button class="btn btn-success btn-lg start" on:click="{() => (paused = !paused)}">Start Game</button>

        <div id="state">
            <h2 id="rangeBar">Game State at Move: {rangeMoves}</h2>
            <input class="custom-range" orient="vertical" on:change="{viewBoardHistory}" bind:value={rangeMoves} type="range" min="0" max="{numMoves}" step="1">
        </div>
    {:else}
        <button class="btn btn-warning btn-lg pause" on:click="{() => (paused = !paused)}">Pause Game</button>

        <button class="btn btn-primary btn-lg switch" on:click="{switchPlayer}">Switch Turn</button>

        <button class="btn btn-secondary btn-lg forfeit" on:click="{() => saveGame(false)}">Save Game</button>
    {/if}
</div>

<style>

	.players {
		left:47.5%;
		position:fixed;
	}

	.navi {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}

	#gameStatus {
		width: calc((100% - 800px)/2);
		height:800px;
		top:calc((100% - 800px)/2);
		position:fixed;
		left:0;
	}

	#gameBtn {
		width: calc((100% - 800px)/2);
		height:800px;
		top:calc((100% - 800px)/2);
		position:fixed;
		right:0;
    }
    
    .start {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-top: 50%;
		margin-left:25%;
		width: 50%;
	}

    .pause {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-top: 50%;
		margin-left:25%;
		width: 50%;
	}
	
	.start {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-top: 50%;
		margin-left:25%;
		width: 50%;
	}

    .switch {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-top: 50%;
		margin-bottom: 50%;
		margin-left:25%;
		width: 50%;
    }

    .save {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-left:25%;
		margin-bottom: 50%;
		width: 50%;
	}
	
	.forfeit {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-left:25%;
		width: 50%;
	}

	#board {
		width:800px;
		height:var(--board-height);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		top:calc((100% - 800px)/2);
		position:fixed;
		left: calc((100% - 800px)/2);
	}

	#hover { 
		width: 100%; 
		height: 100%; 
		background-color: wheat;
	}

	circle {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}

	.checker {
		border-radius:50%;
		height:50px;
		width:50px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		float:right;
	}

	.blacka {
		background-color: black;
	}

	.reda {
		background-color: red;
	}
	
	#player {
		margin-top: 50%;
		text-align:center;
		margin-bottom: 50%;
	}

	#moves {
		margin-bottom: 50%;
		text-align:center;
	}

	#time {
		text-align:center;
	}

	#state {
        width:100%;
        margin-top:100%;
	}

	#rangeBar {
		font-size:20px;
		text-align:center;
		margin-top:50%;
	}

	.custom-range {
        width:100%;
    }

	@media screen and (max-width: 800px) {

        #gameStatus {
            width: 100%;
            height:unset;
            top:unset;
            position:unset;
            left:unset;
        }

        #player {
            font-size:20px;
            margin-top:0px;
            margin-bottom:unset;
            text-align:center;
            width:33.33%;
            float:left;
        }
        
        #time {
			font-size:20px;
            margin-top:0px;
            width:33.33%;
            margin-left:33.33%;
        }

        #moves {
            float:right;
			font-size:20px;
            margin-top:0px;
            margin-bottom:unset;
            text-align:center;
            width:33.33%;
        }
        
        #comp {
            margin-top:10px;
        }
        
        .players {
            left:unset;
            position:unset;
            top:unset;
            bottom:unset;
            text-align:center;
        }

        #board {
			width:100%;
			bottom:unset;
			position:unset;
			left:unset
        }

        #me {
            margin-top:10px;
        }
        
        #gameBtn {
            width: 100%;
            height:unset;
            top:unset;
            position:unset;
            right:unset;
        }

        .start {
            margin-top:10px;
        }

        #state {
			width:100%;
			text-align: center;
			margin-top:-37.5%;
        }

        .pause {
            margin-top:10px;
            position:unset;
            float:left;
            margin-left:0px;
            width:35%;
        }

        .switch {
            margin-top:10px;
            margin-left: 0px;
            position:unset;
            float:right;
            width:35%;
        }

        .forfeit {
            margin-top:20px;
            margin-left:0px;
            float:right;
            position:unset;
            width:35%;
        }

		.checker {
			height:25px;
			width:25px;
		}
    }
</style>