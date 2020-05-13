<script>
	import { Position } from './Scripts/Position.js';
	import { Board } from './Scripts/Board.js';

	$:gameBoard = new Board();

	let rowSquares = [0, 1, 2, 3, 4, 5, 6, 7];
	let colSquares = [0, 1, 2, 3, 4, 5, 6, 7];

	let currPos = null, nextPos = null;

	function setCurrPos(i, j) {
		currPos = gameBoard.getPiece(i, j);
	}

	function setNextPos(i, j) {
		if(gameBoard.isEmpty(i, j) && currPos != null) {
			nextPos = new Position(i, j, 'E');
			gameBoard.doMove(currPos, nextPos);
			gameBoard = gameBoard;
		}
	}
</script>

<div id="board">
	{#each rowSquares as i}
		{#each colSquares as j}
			{#if !gameBoard.isEmpty(i, j)}
				<div class="dark">
					{#if gameBoard.getSide(i, j) == "U"}
						<div class="checker black" on:click="{() => setCurrPos(i, j)}"></div>
					{:else if gameBoard.getSide(i, j) == "D"}
						<div class="checker red" on:click="{() => setCurrPos(i, j)}"></div>
					{/if}
				</div>
			{:else if gameBoard.isEmpty(i, j)}
				{#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}
					<div class="dark" on:click="{() => setNextPos(i, j)}"></div>
				{:else}
					<div class="light"></div>
				{/if}
			{/if}
		{/each}
	{/each}
</div>


<style>
	#board {
		width:800px;
		height:880px;
	}

	.dark {
		width:100px;
		height:100px;
		background-color: brown;
		float: left;
	}

	.light {
		width:100px;
		height:100px;
		background-color: wheat;
		float: left;
	}

	.checker {
		border-radius: 50%;
		border:5px solid white;
		height:70px;
		width:70px;
		margin-left:8.5px;
		margin-top:8.5px;
		position: absolute;
	}

	.black {
		background-color: black;
	}

	.red {
		background-color: red;
	}

</style>