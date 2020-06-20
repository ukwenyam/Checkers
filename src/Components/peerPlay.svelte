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
	
	if($gamePref.oppID != null && $gamePref.opp == null) {
		$currSocket.emit('join-game', { 
			gameID: $gamePref.gameID, 
			email: $currUser.email,
			name: $currUser.name
		});
	}

    let clockTime = $gamePref.time;

    let lastNumMoves = $gamePref.numMoves;

	$currSocket.on('switch-player', (gameID) => {

        if(gameID == $gamePref.gameID) {

			clearInterval(timeInterval);

            console.log('Switching Player');

            gamePref.update(state => {
                state.timer = state.time;
                state.currPlayer = state.currPlayer == "red" ? "black" : "red";;
                return state;
            });

			console.log($gamePref.currPlayer);

			timeInterval = setInterval(countDown, 1000);
        }
	});

	$currSocket.on('piece-move', (data) => {

		if(data.gameID == $gamePref.gameID && data.oppID == $currUser.email) {

			console.log(data);

			if(data.remove != null)
				$gameBoard.removePiece($gameBoard.getPieceFromId(data.id));
			
			let piece = $gameBoard.getPieceFromId(data.id);

			$gameBoard.otherPlayerMove(piece, data.xDiff, data.yDiff);

			gameBoard.set($gameBoard);

			$gamePref.states.push($gameBoard.saveBoardState());

			gamePref.update(state => {
				state.numMoves += 1;
				state.rangeMoves += 1;
				return state;
			});
		}
	});

	let timeInterval = setInterval(countDown, 1000);

	function countDown() {

		if($gamePref.rangeMoves == $gamePref.numMoves && $gamePref.paused == false) {

			//console.log($gamePref.timer);

			if($gamePref.timer > 0) {
				gamePref.update(state => {
					state.timer -= 1;
					state.secondsPlayed += 1;
					return state;
				});
			} else {
				switchPlayer();
				currPos = null, nextPos = null;
				lockedPiece = false;
			}
		}
	}

	function viewBoardHistory() {

		let state = $gamePref.states[$gamePref.rangeMoves];

		gameBoard.set(new Board(state, null));

		setCirclePositions();
	}

	function switchPlayer() {
		
		$currSocket.emit('switch-player', $gamePref.gameID);

		currPos = null, nextPos = null;
		lockedPiece = false;
    }
    
    function startGame() {
        if($gamePref.side == $gamePref.currPlayer) 
            $currSocket.emit('start-game', $gamePref.gameID);
	}

    setInterval(function(){
        if($gamePref.numMoves > lastNumMoves) {
			saveGame(true);
			lastNumMoves = $gamePref.numMoves;
		}
    }, 300000);

    function saveGame(auto) {
        if($gamePref.side == $gamePref.currPlayer && $gamePref.numMoves > 0) 
			$currSocket.emit('game-save', {gameID: $gamePref.gameID, auto: auto, oppID: $gamePref.oppID});
    }
</script>

<div id="gameStatus">
	<h2 id="player">Playing: <i class="fa fa-circle" style="color:{$gamePref.currPlayer};"></i></h2>

	<h2 id="moves">Moves: {$gamePref.numMoves}</h2>

	<h2 id="time">Timer: {$gamePref.timer}</h2>
</div>

<h4 class="players" style="top:0;%">{$gamePref.opp != null ? $gamePref.opp : "Waiting for Other Player"}</h4>

<ThreeD/>

<h4 class="players" style="bottom:0;">{$currUser.name}</h4>

{#if $gamePref.finished}
    <div id="state">
        <h2 id="rangeBar">Game State at Move: {$gamePref.rangeMoves}</h2>
        <input class="custom-range" orient="vertical" disabled="{!$gamePref.paused}" on:change="{viewBoardHistory}" bind:value={$gamePref.rangeMoves} type="range" min="0" max="{$gamePref.numMoves}" step="1">
    </div>
{:else}
    <div id="gameBtn" class="container">
        {#if $gamePref.paused && $gamePref.side == $gamePref.currPlayer && $gamePref.opp != null} 
            <button class="btn btn-success btn-lg start" on:click="{startGame}">Start Game</button>
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
		
		.save {
			margin-top:10px;
            margin-right: 0px;
            position:unset;
            float:right;
            width:35%;
		}

        #state {
			width:100%;
			text-align: center;
			margin-top:-37.5%;
        }

        .switch {
            margin-top:10px;
            margin-left: 0px;
            position:unset;
            float:left;
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