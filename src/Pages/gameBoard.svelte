<script>
	import { Position } from '../Scripts/Position.js';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { gameBoard, gameHistory, gamePref, currSocket, currUser } from '../Scripts/Init.js';
    import Chat from '../Components/gameChat.svelte';
    
    let currPlayer;

    let paused = true;

    if($gamePref.pri == $currUser.name)
	    currPlayer = Math.floor(Math.random() * 2) == 0 ? "red" : "black";
		
	let currPos = null, nextPos = null;

	let timer = $gamePref.time, lockedPiece = false;

	let screenWidth = screen.width, remWidth;

	let numMoves = 0, rangeMoves = 0;

	let size;

	const cirPos = spring([]);

	let squares = [0, 1, 2, 3, 4, 5, 6, 7];

	let squareSize, boardHeight, factor;

	

	 $currSocket.emit('set-username', $currUser.name);

	 $currSocket.emit('join-room', $gamePref.id, $currUser.name);

	 $currSocket.on('second-user', (data) => {
		console.log('Received other username');
		gamePref.update(state => {
			state.sec = data;
			return state;
		});
		console.log("emitting starting player");
		$currSocket.emit('starting-player', {player: currPlayer, room: $gamePref.id});
	 });

	$currSocket.on('starting-player', (data) => {
		console.log('Received starting player');
		currPlayer = data;
	});

	console.log('currPlayer: '+currPlayer);

	$currSocket.on('piece-move', (data) => {
		
	});

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
		remWidth = 0.8 * (screen.width - boardHeight);
	}

	document.documentElement.style.setProperty('--chat-width', remWidth + 'px');

	document.documentElement.style.setProperty('--board-height', boardHeight + 'px');

	setCirclePositions();

	/* setInterval(function() {
		if(currPos != null)
			highlightCircle(currPos);
	}, 100); */

	setInterval(function() {
		if(rangeMoves == numMoves && !paused) {
			timer--;

			if(timer == -1) {
				switchPlayer();
				timer = $gamePref.time;
			}
		}
	}, 1000);
	
		
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
                        
                        /* if($gamePref.pri == $currUser.name)
                            state[id].s = $gameBoard.getSide(i, j) == "black" ? 0 : 1;
                        else 
                            state[id].s = $gameBoard.getSide(i, j) == "red" ? 0 : 1; */

						return state; 
					});
				} 
			}
		}
	}

	function setCurrPos(i, j, evt) {
		//console.log(i + ", " + j);

		if($gameBoard.getSide(i, j) == currPlayer && lockedPiece == false && rangeMoves == numMoves) {

			/* let litCircle = document.getElementById($gameBoard.getId(i,j));

			let allCircles, index;

			if($gameBoard.getSide(i,j) == "U") {
				allCircles = document.getElementsByClassName("checkBlack");

				for (index = 0; index < allCircles.length; ++index) 
					allCircles[index].setAttribute("style", "fill:black");
				
				litCircle.setAttribute("style", "fill:grey");
			}
			else {
				allCircles = document.getElementsByClassName("checkRed");

				for (index = 0; index < allCircles.length; ++index) 
					allCircles[index].setAttribute("style", "fill:red");

				litCircle.setAttribute("style", "fill:pink");
			} */

			let newtarget = evt.target || event.target;
			let topmost = document.getElementById("use");
			topmost.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href","#" + newtarget.id);
			currPos = $gameBoard.getPiece(i, j);
		}
			
		//let pos = currPos.getPosition();

		//console.log(pos.xPos + ", " + pos.yPos);
	}

	function setNextPos(i, j) {
		
		if($gameBoard.isEmpty(i, j) && currPos != null && rangeMoves == numMoves) {

			nextPos = new Position(i, j, 'E');

            let move = $gameBoard.doMove(currPos, nextPos);

			gameBoard.set($gameBoard);

			//console.log($gameBoard);

			if(move) {
				lockedPiece = true; 
				let pieceInfo = {
					id : $gameBoard.getId(i, j),
					currPos: currPos,
					nextPos: nextPos,
					room: $gamePref.id
				}

				$currSocket.emit('piece-move',  pieceInfo)

				updateCirclePositions(nextPos);
                
                gameHistory.update(state => {
                    state.push($gameBoard.saveBoardState());
                    return state;
                });

				numMoves++; rangeMoves++;

				currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos);
			}
		}
	}

	function viewBoardHistory() {

		gameBoard.set(new Board($gameHistory[rangeMoves], null));

		setCirclePositions();
	}

	function highlightCircle(currPos) {

		let i = currPos.getPosition().xPos, j = currPos.getPosition().yPos;

		let litCircle = document.getElementById($gameBoard.getId(i, j));

		if($gameBoard.getSide(i,j) == "U") 
			litCircle.setAttribute("style", "fill:grey");
		else 
			litCircle.setAttribute("style", "fill:pink");
	}

	function switchPlayer() {

		let allCircles, index;

		if(currPlayer == 0) {

			allCircles = document.getElementsByClassName("checkBlack");

			for (index = 0; index < allCircles.length; ++index) 
				allCircles[index].setAttribute("style", "fill:black");

		} else {

			allCircles = document.getElementsByClassName("checkRed");

			for (index = 0; index < allCircles.length; ++index) 
				allCircles[index].setAttribute("style", "fill:red");

		}

		currPlayer = currPlayer == "red" ? "black" : "red";
		currPos = null, nextPos = null;
		lockedPiece = false;
	}
</script>

<h2 id="player">Current Player:</h2>

{#if currPlayer == 0}
	<div class="checker black"></div>
{:else}
	<div class="checker red"></div>
{/if}

<h2 id="moves">Moves: {numMoves}</h2>

{#if screenWidth > 800}
	<h2 id="time">Timer: {timer}</h2>
{/if}

<div id="board">
	<svg id="hover">
		{#each squares as i}
			{#each squares as j}
				{#if !$gameBoard.isEmpty(i, j)}
					<rect width="{squareSize}" height="{squareSize}" style="fill:brown;" x="{j * squareSize}" y="{i * squareSize}"/>
					<circle id="{$gameBoard.getId(i, j)}" on:click="{() => setCurrPos(i, j, event)}" cx="{$cirPos[$gameBoard.getId(i, j)].y}" cy="{$cirPos[$gameBoard.getId(i, j)].x}" r="{$size}" stroke="white" stroke-width="{$gameBoard.getPiece(i,j).stack * 2}" fill="{$gameBoard.getSide(i, j)}" />
				{:else if $gameBoard.isEmpty(i, j)}
                    {#if $gamePref.pri == $currUser.name}
                        {#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}
                            <rect on:click="{() => setNextPos(i, j)}" width="{squareSize}" height="{squareSize}" style="fill:brown;" x="{j * squareSize}" y="{i * squareSize}"/>
                        {/if}
                    {:else}
                        {#if (i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)}
                            <rect on:click="{() => setNextPos(i, j)}" width="{squareSize}" height="{squareSize}" style="fill:brown;" x="{j * squareSize}" y="{i * squareSize}"/>
                        {/if}
                    {/if}
				{/if}
			{/each}
		{/each}
		<use id="use" xlink:href="#24" />
	<svg>
</div>

{#if screenWidth <= 800}
	<h1 id="time">Timer: {timer}</h1>
{/if}

<div id="state">
    <h2 id="rangeBar">Game State at Move: {rangeMoves}</h2>
    <input class="custom-range" on:change="{viewBoardHistory}" bind:value={rangeMoves} type="range" min="0" max="{numMoves}" step="1">
</div>

<div id="chat" class="container-fluid">
    <Chat/>
</div>

<style>

	#chat {
		height:var(--board-height);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		bottom:5px;
		right:5px;
		position:fixed;
		width:var(--chat-width);
		border-radius:0.4rem;
		display: flex;
		flex-direction: column;
		background-color: white;
		opacity: 0.9;
	}

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
		background-color: wheat;
	}

	circle {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}

	.checker {
		border-radius:50%;
		height:40px;
		width:40px;
		float:left;
		margin-left:10px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

	#state {
		float:left;
		width:400px;
		margin-left:80px;
	}

	#rangeBar {
		font-size:20px;
		width:100%;
	}

	.custom-range {
		width:100%;
	}

	@media screen and (max-height: 800px) {

		#board {
			width:var(--board-height);;
			height:var(--board-height);
			box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
			bottom:5px;
			position:fixed;
		}
	}

	@media screen and (max-width: 800px) {

		#state {
			float:unset;
			width:100%;
			text-align: center;
			margin-top:20px;
			margin-left:unset;
			float:unset;
		}
        
        #board {
			width:100%;
			bottom:unset;
			position:unset;
			margin-top:30px;
		}

		.checker {
			height:25px;
			width:25px;
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