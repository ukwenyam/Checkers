<script>
	import { Position } from '../Scripts/Position.js';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { invokeFunction } from '../Scripts/Cloud.js';
	import { fly, fade } from 'svelte/transition';
	import Blur from './blurScreen.svelte';
    import { gameBoard, gameHistory, gamePref, currSocket, currUser, page } from '../Scripts/Init.js';

    $currSocket.emit('join-room', $gamePref.gameID, $currUser.name);

    let clockTime = $gamePref.time;

    let lastNumMoves = $gamePref.numMoves;
	    
	let currPos = null, nextPos = null;

	let lockedPiece = false;

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

            if(state.pri == $currUser.name)
                state.secMoves += 1;

            if(state.sec == $currUser.name)
                state.priMoves += 1;

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

		if($gamePref.rangeMoves == $gamePref.numMoves && !$gamePref.paused) {

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

                    if(state.pri == $currUser.name)
                        state.priMoves += 1;

                    if(state.sec == $currUser.name)
                        state.secMoves += 1;

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
					room: $gamePref.gameID
				}

				$currSocket.emit('piece-move', pieceInfo)

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
            
            $currSocket.emit('switch-player', $gamePref.gameID);
			
			gamePref.update(state => {
				state.currPlayer = state.currPlayer == "red" ? "black" : "red";
				state.timer = clockTime;
                return state;
            });

            currPos = null, nextPos = null;
			lockedPiece = false;
			
			timeInterval = setInterval(countDown, 1000);
        }
    }
    
    function startGame() {

        if($gamePref.side == $gamePref.currPlayer) {

            gamePref.update(state => {
                state.paused = false;
                return state;
            });

            $currSocket.emit('start-game', $gamePref.gameID);
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
				id: $currUser.email,
                gameID: $gamePref.gameID,
                gameHistory: $gameHistory,
                priMoves: $gamePref.priMoves,
                secMoves: $gamePref.secMoves,
				minutes: Math.floor($gamePref.secondsPlayed / 60),
				currPlayer: $gamePref.currPlayer,
				auto: auto,
				saved: false
			}
			
			if(auto) {
				$currSocket.emit('save-game', request);
				timeInterval = setInterval(countDown, 1000);
			} else {
                $currSocket.emit('save-game', request);
                //gameBoard.set(null);
				gamePref.set(null);
			}
        }
    }
</script>

<div id="gameStatus">
	<h2 id="player">Playing: <i class="fa fa-circle" style="color:{$gamePref.currPlayer};"></i></h2>

	<h2 id="moves">Moves: {$gamePref.numMoves}</h2>

	<h2 id="time">Timer: {$gamePref.timer}</h2>
</div>

<h4 class="players" style="top:0;%">{$gamePref.pri == $currUser.name ? $gamePref.sec : $gamePref.pri}</h4>

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

<h4 class="players" style="bottom:0;">{$gamePref.pri == $currUser.name ? $gamePref.pri : $gamePref.sec}</h4>

{#if $gamePref.finished}
    <div id="state">
        <h2 id="rangeBar">Game State at Move: {$gamePref.rangeMoves}</h2>
        <input class="custom-range" orient="vertical" disabled="{!$gamePref.paused}" on:change="{viewBoardHistory}" bind:value={$gamePref.rangeMoves} type="range" min="0" max="{$gamePref.numMoves}" step="1">
    </div>
{:else}
    <div id="gameBtn" class="container">
        {#if $gamePref.paused && $gamePref.side == $gamePref.currPlayer && $gamePref.pri != null && $gamePref.sec != null} 
            <button class="btn btn-success btn-lg pause" on:click="{startGame}">Start Game</button>
        {/if}

        {#if $gamePref.side == $gamePref.currPlayer && $gamePref.numMoves > 0}
            <button class="btn btn-primary btn-lg switch" on:click="{switchPlayer}">Switch Turn</button>

            <button class="btn btn-warning btn-lg save" on:click="{() => saveGame(false)}">Save Game</button>

            <button class="btn btn-danger btn-lg forfeit" on:click="{() => saveGame(false)}">Forfeit Game</button>
        {/if}
    </div>
{/if}

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