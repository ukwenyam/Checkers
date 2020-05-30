<script>
	import { Position } from '../Scripts/Position.js';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { invokeFunction } from '../Scripts/Cloud.js';
	import { fly } from 'svelte/transition';
    import { gameBoard, gameHistory, gamePref, currSocket, currUser, gameChat, page } from '../Scripts/Init.js';

    if($gamePref.pri == $currUser.name && $gamePref.currPlayer == null && $gamePref.sec == null) {
        gamePref.update(state => {
            state.currPlayer = Math.floor(Math.random() * 2) == 0 ? "red" : "black";
            return state;
        });
    }
	    
	let currPos = null, nextPos = null;

	let clockTime = $gamePref.time, lockedPiece = false;

    let screenWidth = screen.width, remWidth;

	let size;

	const cirPos = spring([]);

	let squares = [0, 1, 2, 3, 4, 5, 6, 7];

	let squareSize, boardHeight, factor, btnWidth;

	let lastNumMoves = $gamePref.numMoves;

	$currSocket.emit('set-username', $currUser.name);

	$currSocket.emit('join-room', $gamePref.id, $currUser.name);

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

	$currSocket.on('piece-move', async (data) => {

        console.log(data);

        if(data.remove != null) {

            let piece = await $gameBoard.getPieceFromId(data.id);

            await $gameBoard.removePiece(piece);
        }
        
        let piece = await $gameBoard.getPieceFromId(data.id);

        await $gameBoard.otherPlayerMove(piece, data.xDiff, data.yDiff);

        await gameBoard.set($gameBoard);

        $gameHistory.push($gameBoard.saveBoardState());

        await setCirclePositions();

        await gamePref.update(state => {
            state.numMoves = data.num;
            state.rangeMoves = data.range;
            return state;
        });
    });

	document.documentElement.style.setProperty('--chat-width', remWidth + 'px');

    document.documentElement.style.setProperty('--board-height', boardHeight + 'px');
    
    document.documentElement.style.setProperty('--btn-width', btnWidth + 'px');

	setCirclePositions();

	let timeInterval = setInterval(countDown, 1000);

	function countDown() {

		if(currPos != null)
			highlightCircle(currPos);

		if($gamePref.rangeMoves == $gamePref.numMoves && $gamePref.paused == false) {

			//console.log($gamePref.timer);

			if($gamePref.timer > 0) {

				gamePref.update(state => {
					state.timer -= 1;
					state.secondsPlayed += 1;
					return state;
				});
			} else {
				clearInterval(timeInterval);

				gamePref.update(state => {
					state.currPlayer = state.currPlayer == "red" ? "black" : "red";
					state.timer = state.time;
					state.secondsPlayed += 1;
					return state;
				});

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

		console.log(i + ", " + j);

		if($gamePref.currPlayer == $gamePref.side && lockedPiece == false && $gamePref.rangeMoves == $gamePref.numMoves && $gamePref.paused == false && $gamePref.sec != null) {

			let litCircle = document.getElementById($gameBoard.getId(i,j));

			let allCircles, index;

			if($gameBoard.getSide(i,j) == "black" && $currUser.name == $gamePref.sec) {
				allCircles = document.getElementsByClassName("black");

				for (index = 0; index < allCircles.length; ++index) 
					allCircles[index].setAttribute("style", "fill:black");
				
				litCircle.setAttribute("style", "fill:grey");
            }
            
			if($gameBoard.getSide(i,j) == "red" && $currUser.name == $gamePref.pri) {
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
		
		if($gameBoard.isEmpty(i, j) && currPos != null && $gamePref.rangeMoves == $gamePref.numMoves) {

			nextPos = new Position(i, j, 'E');

            let res = $gameBoard.doMove(currPos, nextPos);

            console.log(res.move);

			gameBoard.set($gameBoard);

			console.log($gameBoard);

			if(res.move) {

                gamePref.update(state => {
                    state.numMoves += 1;
                    state.rangeMoves += 1;
                    return state;
                });

                lockedPiece = true; 
                
				let pieceInfo = {
					id : $gameBoard.getId(i, j),
					xDiff: currPos.getPosition().xPos - nextPos.xPos,
                    yDiff: currPos.getPosition().yPos - nextPos.yPos,
                    remove : res.id,
                    num: $gamePref.numMoves,
                    range: $gamePref.rangeMoves,
					room: $gamePref.id
				}

				$currSocket.emit('piece-move',  pieceInfo)

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

        if($gamePref.side == $gamePref.currPlayer) {

			clearInterval(timeInterval);

            let allCircles, index;

            if($gamePref.currPlayer == "black") {

                allCircles = document.getElementsByClassName("black");

                for (index = 0; index < allCircles.length; ++index) 
                    allCircles[index].setAttribute("style", "fill:black");
            } 
            
            if($gamePref.currPlayer == "red") {

                allCircles = document.getElementsByClassName("red");

                for (index = 0; index < allCircles.length; ++index) 
                    allCircles[index].setAttribute("style", "fill:red");
			}
			
			gamePref.update(state => {
				state.currPlayer = state.currPlayer == "red" ? "black" : "red";
				state.timer = clockTime;
                return state;
            });

            $currSocket.emit('current-player', {player: $gamePref.currPlayer, room: $gamePref.id});

            currPos = null, nextPos = null;
			lockedPiece = false;
			
			timeInterval = setInterval(countDown, 1000);
        }
    }
    
    function startGame() {

        if($gamePref.side == $gamePref.currPlayer) {

            gamePref.update(state => {
                state.paused = !state.paused;
                return state;
            });

            $currSocket.emit('paused', {paused: $gamePref.paused, room: $gamePref.id});
        }
	}

    setInterval(function(){
        if($gamePref.numMoves > lastNumMoves) {
			saveGame(true);
			lastNumMoves = $gamePref.numMoves;
		}
    }, 300000);

    function saveGame(auto) {

        if($gamePref.side == $gamePref.currPlayer && $gamePref.numMoves > 0) {

			clearInterval(timeInterval);

            let request = {
                func: "saveGame",
                gameID: $gamePref.id,
                gameHistory: JSON.stringify($gameHistory),
                chatHistory: JSON.stringify($gameChat),
                pri: $gamePref.pri == $currUser.name ? true : false,
                sec: $gamePref.sec == $currUser.name ? true : false,
				minutes: Math.floor($gamePref.secondsPlayed / 60),
				currPlayer: $gamePref.currPlayer,
				auto: auto,
				saved: false
			}
			
			if(auto) {
				timeInterval = setInterval(countDown, 1000);
			} else {
				$currSocket.emit('saveGame', request);
				page.set(0);
			}
        }
    }
</script>

{#if $gamePref.pri == $currUser.name && $gamePref.sec == null && screenWidth < 800 && $gamePref.numMoves == 0}
	<div id="popUp" class="container-fluid" transition:fly={{ y:-200, duration:1000 }}>
		<h5 style="text-align:center;margin-top:50%;">Please share Game Password '{$gamePref.id}' with other player</h5>
    </div>
{/if}

<h2 id="player">Current Player:</h2>

{#if $gamePref.currPlayer == "black"}
	<div class="checker blacka"></div>
{:else if $gamePref.currPlayer == "red"}
	<div class="checker reda"></div>
{/if}

<h2 id="moves">Moves: {$gamePref.numMoves}</h2>

{#if screenWidth > 800}
	<h2 id="time">Timer: {$gamePref.timer}</h2>
{/if}

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

{#if screenWidth <= 800}
	<h1 id="time">Timer: {$gamePref.timer}</h1>
{/if}

{#if $gamePref.finished}
	<div id="state">
		<h2 id="rangeBar">Game State at Move: {$gamePref.rangeMoves}</h2>
		<input class="custom-range" disabled="{!$gamePref.paused}" on:change="{viewBoardHistory}" bind:value={$gamePref.rangeMoves} type="range" min="0" max="{$gamePref.numMoves}" step="1">
	</div>
{/if}

{#if $gamePref.paused && $gamePref.side == $gamePref.currPlayer && $gamePref.pri != null && $gamePref.sec != null} 
    <button class="btn btn-success pause" on:click="{startGame}">Start Game</button>\
{/if}

{#if $gamePref.side == $gamePref.currPlayer && $gamePref.numMoves > 0}
	<button class="btn btn-info switch" on:click="{switchPlayer}">Switch Turn</button>

	<button class="btn btn-primary save" on:click="{() => saveGame(false)}">Save Game</button>
{/if}
<style>
    .pause {
        width:var(--btn-width);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        left: 820px;
        bottom: 450px;
        position:fixed;
    }

    .switch {
        width:var(--btn-width);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        left: 820px;
        bottom: 350px;
        position:fixed;
    }

    .save {
        width:var(--btn-width);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        left: 820px;
        bottom: 250px;
        position:fixed;
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

	.blacka {
		background-color: black;
	}

	.reda {
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

	@media screen and (max-width: 800px) {

		#popUp {
			width:100%;
			height:100%;
			background-color: pink;
			z-index:99; 
			border-radius:0.4rem;
			top:0;
			left:0;
			position:fixed;
		}

        .pause {
            width:50%;
            margin-top:40px;
            margin-left: 25%;
            position:unset;
        }

        .switch {
            width:50%;
            margin-top:30px;
            margin-left: 25%;
            position:unset;
        }

        .save {
            width:50%;
            margin-top:30px;
            margin-left: 25%;
            position:unset;
        }

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