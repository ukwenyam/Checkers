<script>
	import { Position } from './Scripts/Position.js';
	import { Board } from './Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';

	let size = spring(40);

	let gameBoard = new Board();

	const cirPos = spring([]);

	let squares = [0, 1, 2, 3, 4, 5, 6, 7];

	let currPos = null, nextPos = null;

	setCirclePositions();

	function updateCirclePositions(nextPos) {

		let a = nextPos.xPos, b = nextPos.yPos;

		let id = gameBoard.getId(a, b);

		cirPos.update(state => {
			state[id].x = (a + a + 1) * 50;
			state[id].y = (b + b + 1) * 50;
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
						state[id].x = (i + i + 1) * 50;  
						state[id].y = (j + j + 1) * 50; 
						state[id].s = gameBoard.getSide(i, j) == "U" ? 0 : 1;
						return state; 
					});

				} 
			}
		}
	}

	function setCurrPos(i, j, evt) {
		//console.log(i + ", " + j);

		let newtarget = evt.target;
		let topmost = document.getElementById("use");
		topmost.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href","#" + newtarget.id);
		
		currPos = gameBoard.getPiece(i, j);

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
			
		}
	}
</script>


<div id="board">
<svg>
	{#each squares as i}
		{#each squares as j}
			{#if !gameBoard.isEmpty(i, j)}
				<rect width="100" height="100" style="fill:brown;" x="{j * 100}" y="{i * 100}"/>
				{#if $cirPos[gameBoard.getId(i, j)].s == 0}
					<circle id="{gameBoard.getId(i, j)}" class="checker" on:click="{() => setCurrPos(i, j, event)}" cx="{$cirPos[gameBoard.getId(i, j)].y}" cy="{$cirPos[gameBoard.getId(i, j)].x}" r="{$size}" stroke="white" stroke-width="3" fill="black" />
				{:else if $cirPos[gameBoard.getId(i, j)].s == 1}
					<circle id="{gameBoard.getId(i, j)}" class="checker" on:click="{() => setCurrPos(i, j, event)}" cx="{$cirPos[gameBoard.getId(i, j)].y}" cy="{$cirPos[gameBoard.getId(i, j)].x}" r="{$size}" stroke="white" stroke-width="3" fill="red" />					
				{/if}
			{:else if gameBoard.isEmpty(i, j)}
				{#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}
					<rect on:click="{() => setNextPos(i, j)}" width="100" height="100" style="fill:brown;" x="{j * 100}" y="{i * 100}"/>
				{:else}
					<rect width="100" height="100" style="fill:wheat;" x="{j * 100}" y="{i * 100}"/>
				{/if}
			{/if}
		{/each}
	{/each}
	<use id="use" xlink:href="24" />
<svg>
</div>

<style>
	#board {
		width:800px;
		height:880px;
		position: absolute;
	}

	svg { 
		width: 100%; 
		height: 800px; 
		background-color: blue;
	}

	rect {
		z-index: 0;
	}

	circle {
		z-index: 3;
	}
</style>