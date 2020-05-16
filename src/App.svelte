<script>
	import { Position } from './Scripts/Position.js';
	import { Board } from './Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';

	let currPlayer = 0;

	let size;

	let gameBoard = new Board();

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
		size = spring(40);
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

		if($cirPos[gameBoard.getId(i, j)].s == currPlayer) {
			console.log(gameBoard.getPiece(i, j).stack);
			let newtarget = evt.target || event.target;
			let topmost = document.getElementById("use");
			topmost.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href","#" + newtarget.id);
			currPos = gameBoard.getPiece(i, j);
		}
			
		//let pos = currPos.getPosition();

		//console.log(pos.xPos + ", " + pos.yPos);
	}

	function setNextPos(i, j) {
		
		if(gameBoard.isEmpty(i, j) && currPos != null) {

			nextPos = new Position(i, j, 'E');

			let move = gameBoard.doMove(currPos, nextPos);

			console.log(gameBoard);

			gameBoard = gameBoard;

			if(move) {
				updateCirclePositions(nextPos);
			}

			currPlayer = currPlayer == 0 ? 1 : 0;

			currPos = null, nextPos = null;
		}
	}
</script>


<div id="board">
	<svg>
		{#each squares as i}
			{#each squares as j}
				{#if !gameBoard.isEmpty(i, j)}
					<rect width="100" height="100" style="fill:brown;" x="{j * squareSize}" y="{i * squareSize}"/>
					{#if $cirPos[gameBoard.getId(i, j)].s == 0}
						<circle id="{gameBoard.getId(i, j)}" class="checker" on:click="{() => setCurrPos(i, j, event)}" cx="{$cirPos[gameBoard.getId(i, j)].y}" cy="{$cirPos[gameBoard.getId(i, j)].x}" r="{$size}" stroke="white" stroke-width="{gameBoard.getPiece(i,j).stack * 2}" fill="black" />
					{:else if $cirPos[gameBoard.getId(i, j)].s == 1}
						<circle id="{gameBoard.getId(i, j)}" class="checker" on:click="{() => setCurrPos(i, j, event)}" cx="{$cirPos[gameBoard.getId(i, j)].y}" cy="{$cirPos[gameBoard.getId(i, j)].x}" r="{$size}" stroke="white" stroke-width="{gameBoard.getPiece(i,j).stack * 2}" fill="red" />					
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

<style>
	#board {
		width:800px;
		height:var(--board-height);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}

	svg { 
		width: 100%; 
		height: 100%; 
		background-color: blue;
	}

	@media screen and (max-width: 800px) {
        
        #board {
			width:100%;
		}

    }
</style>