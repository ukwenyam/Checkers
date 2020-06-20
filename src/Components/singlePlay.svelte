<script>
	import { Position } from '../Scripts/Position.js';
	import ThreeD from './threeD.svelte';
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

	let timeInterval = setInterval(countDown, 1000);

	function countDown() {

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

	function viewBoardHistory() {

		gameBoard.set(new Board($gameHistory[$gamePref.rangeMoves], null));
	}

	function switchPlayer() {

        if(side == currPlayer) {

			clearInterval(timeInterval);
            
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

<ThreeD/>

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
	
	.forfeit {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-left:25%;
		width: 50%;
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
			width:90%;
			float:left;
			text-indent:10%;
        }
        
        .players {
            left:unset;
            position:unset;
            top:unset;
            bottom:unset;
			text-align:center;
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
    }
</style>