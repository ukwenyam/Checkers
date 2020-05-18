<script>
	import { Position } from './Scripts/Position.js';
	import { Board } from './Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';

	let currPlayer = Math.floor(Math.random() * 2);

	let timer = 10, lockedPiece = false;

	let screenWidth = screen.width;

	setInterval(function() {
		timer--;

		if(timer == 0) {
			currPlayer = currPlayer == 0 ? 1 : 0;
			currPos = null, nextPos = null;
			lockedPiece = false;
		}

		if(timer == -1)
			timer = 10;
	}, 1000);

	let numMoves = 0, rangeMoves = 0;

	let size;

	let gameBoard = new Board();

	let boardHistory = [];

	boardHistory.push(gameBoard.getBoard());

	const cirPos = spring([]);

	let squares = [0, 1, 2, 3, 4, 5, 6, 7];

	let currPos = null, nextPos = null;

	let squareSize, boardHeight, factor;

	if(screen.width <= 800) {
		factor = 800 / (screen.width - 12.5); 
		squareSize = Math.floor((screen.width - 10) / 8);

		if(screen.width >= 500)
			size = spring(25);
		else
			size = spring(12.5);

		boardHeight = squareSize * 8;
	} else {
		factor = 1;
		size = spring(30);
		squareSize = 100;
		boardHeight = squareSize * 8;
	}

	document.documentElement.style.setProperty('--board-height', boardHeight + 'px');

	setCirclePositions();
		
	function updateCirclePositions(nextPos) {

		let i = nextPos.xPos, j = nextPos.yPos;

		let id = gameBoard.getId(i, j);

		cirPos.update(state => {
			state[id].x = (i + i + 1) * (50 / factor);  
			state[id].y = (j + j + 1) * (50 / factor); 
			return state;
		});
	}

	function setCirclePositions() {

		for(let i = 0; i < 8; i++) {
			
			for(let j = 0; j < 8; j++) {

				if(!gameBoard.isEmpty(i, j)) {

					let id = gameBoard.getId(i, j);

					cirPos.update(state => {
						state[id] = {};
						state[id].x = (i + i + 1) * (50 / factor);  
						state[id].y = (j + j + 1) * (50 / factor); 
						state[id].s = gameBoard.getSide(i, j) == "U" ? 0 : 1;
						return state; 
					});

				} 
			}
		}
	}

	function setCurrPos(i, j, evt) {
		//console.log(i + ", " + j);

		if($cirPos[gameBoard.getId(i, j)].s == currPlayer && lockedPiece == false) {

			let litCircle = document.getElementById(gameBoard.getId(i,j));

			if(gameBoard.getSide(i,j) == "U")
				litCircle.setAttribute("style", "fill:grey");
			else
				litCircle.setAttribute("style", "fill:pink");

			let newtarget = evt.target || event.target;
			let topmost = document.getElementById("use");
			topmost.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href","#" + newtarget.id);
			currPos = gameBoard.getPiece(i, j);
			lockedPiece = true;
		}
			
		//let pos = currPos.getPosition();

		//console.log(pos.xPos + ", " + pos.yPos);
	}

	function setNextPos(i, j) {
		
		if(gameBoard.isEmpty(i, j) && currPos != null) {

			nextPos = new Position(i, j, 'E');

			let move = gameBoard.doMove(currPos, nextPos);

			//console.log(gameBoard);

			if(move) {
				updateCirclePositions(nextPos);

				let currBoard = gameBoard;

				boardHistory.push(currBoard.getBoard());

				numMoves++; rangeMoves++;

				currPos = gameBoard.getPiece(nextPos.xPos, nextPos.yPos);

				let litCircle = document.getElementById(gameBoard.getId(nextPos.xPos, nextPos.yPos));

				if(gameBoard.getSide(nextPos.xPos, nextPos.yPos) == "U") {
					litCircle.setAttribute("style", "fill:grey");
					litCircle.setAttribute("fill", "grey");
				}
				else {
					litCircle.setAttribute("style", "fill:pink");
					litCircle.setAttribute("fill", "pink");
				}

				console.log(litCircle)
			}
		}
	}

	function viewBoardHistory() {

		//gameBoard = boardHistory[rangeMoves];

		for(let i = 0; i < numMoves; i++) {
			console.log(boardHistory[i]);
		}

		//setCirclePositions();
	}
</script>

<h1 id="player">CURRENT PLAYER:</h1>

{#if currPlayer == 0}
	<div class="checker black"></div>
{:else}
	<div class="checker red"></div>
{/if}

<h1 id="moves">MOVES: {numMoves}</h1>

{#if screenWidth > 800}
	<h1 id="time">TIMER: {timer}</h1>
{/if}

<div id="board">
	<svg id="hover">
		{#each squares as i}
			{#each squares as j}
				{#if !gameBoard.isEmpty(i, j)}
					<rect width="100" height="100" style="fill:brown;" x="{j * squareSize}" y="{i * squareSize}"/>
					{#if $cirPos[gameBoard.getId(i, j)].s == 0}
						<circle id="{gameBoard.getId(i, j)}" on:click="{() => setCurrPos(i, j, event)}" cx="{$cirPos[gameBoard.getId(i, j)].y}" cy="{$cirPos[gameBoard.getId(i, j)].x}" r="{$size}" stroke="white" stroke-width="{gameBoard.getPiece(i,j).stack * 2}" fill="black" />
					{:else if $cirPos[gameBoard.getId(i, j)].s == 1}
						<circle id="{gameBoard.getId(i, j)}" on:click="{() => setCurrPos(i, j, event)}" cx="{$cirPos[gameBoard.getId(i, j)].y}" cy="{$cirPos[gameBoard.getId(i, j)].x}" r="{$size}" stroke="white" stroke-width="{gameBoard.getPiece(i,j).stack * 2}" fill="red" />					
					{/if}
				{:else if gameBoard.isEmpty(i, j)}
					{#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}
						<rect on:click="{() => setNextPos(i, j)}" width="100" height="100" style="fill:brown;" x="{j * squareSize}" y="{i * squareSize}"/>
					{:else}
						<rect width="100" height="100" style="fill:wheat;" x="{j * squareSize}" y="{i * squareSize}"/>
					{/if}
				{/if}
			{/each}
		{/each}
		<use id="use" xlink:href="#24" />
	<svg>
</div>

{#if screenWidth <= 800}
	<h1 id="time">TIMER: {timer}</h1>
{/if}

<div style="position:fixed;right:10px;width:400px;">
	<label>
		<h3>Board History (Moves): {rangeMoves}</h3>
		<input style="width:100%" on:change="{viewBoardHistory}" bind:value={rangeMoves} type="range" min="0" max="{numMoves}" step="1">
	</label>
</div>

<style>
	#board {
		width:800px;
		height:var(--board-height);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		bottom:5px;
		position:fixed;
	}

	#hover { 
		width: 100%; 
		height: 100%; 
		background-color: blue;
	}

	.checker {
		border-radius:50%;
		height:60px;
		width:60px;
		margin-top:10px;
		float:left;
		margin-left:10px;
	}

	.black {
		background-color: black;
	}

	.red {
		background-color: red;
	}
	
	#player {
		float:left;
	}

	#moves {
		margin-left:50px;
		float:left;
	}

	#time {
		margin-left:80px;
		float:left;
	}

	@media screen and (max-width: 800px) {
        
        #board {
			width:100%;
			bottom:unset;
			position:unset;
			margin-top:50px;
		}

		.checker {
			height:30px;
			width:30px;
		}

		#player {
			font-size:20px;
		}

		#moves {
			margin-left:unset;
			font-size:20px;
			float:right;
		}

		#time {
			float:unset;
			font-size:20px;
			margin-top:20px;
			margin-left:unset;
			text-align:center;
		}
    }
</style>