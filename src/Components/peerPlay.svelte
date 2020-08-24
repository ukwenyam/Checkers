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
			email: $currUser.profile.email,
			name: $currUser.profile.name
		});
	}

	let rangeMoves;

	if($gamePref.finished) {
		rangeMoves = $gameHistory.length - 1;
	}

	let lastNumMoves = $gameBoard.numMoves;
	
	let currPos, nextPos;

	$currSocket.on('switch-player', (gameID) => {

        if(gameID == $gamePref.gameID) {

			currPos = null, nextPos = null;

			clearInterval(timeInterval);

			console.log('Switching Player');

            gamePref.update(state => {
				state.rangeMoves = $gameBoard.numMoves;
				state.currPlayer = state.currPlayer == 0 ? 1 : 0;
				state.timer = state.time;
                return state;
            });

			timeInterval = setInterval(countDown, 1000);
        }
	});

	let timeInterval = setInterval(countDown, 1000);

	function countDown() {

		if($gamePref != null) {

			if(!$gamePref.finished && $gamePref.secondsPlayed % 300 == 0 && $gamePref.secondsPlayed >= 300) {
				if($gameBoard.numMoves > lastNumMoves) {
					saveGame(true);
					lastNumMoves = $gameBoard.numMoves;
				}
			}

			if(!$gamePref.finished && $gamePref.rangeMoves == $gameBoard.numMoves && !$gamePref.paused && $gamePref.currPlayer == $gamePref.side) {

				console.log($currUser.profile.name);

				if($gamePref.timer > 0) {
					gamePref.update(state => {
						state.timer -= 1;
						return state;
					});
				} else {
					switchPlayer();
					currPos = null, nextPos = null;
				}
			}

			if(!$gamePref.paused && !$gamePref.finished) {
				gamePref.update(state => {
					state.secondsPlayed += 1;
					return state;
				});
			}
		}
	}

	function viewBoardHistory() {
		gameBoard.set(new Board($gameHistory[rangeMoves], null));
	}

	function switchPlayer() {
		$currSocket.emit('switch-player', $gamePref.gameID);
    }
    
    function startGame() {
        if($gamePref.side == $gamePref.currPlayer) 
            $currSocket.emit('start-game', $gamePref.gameID);
	}

    function saveGame(auto) {
        if($gamePref.side == $gamePref.currPlayer && $gameBoard.numMoves > 0) 
			$currSocket.emit('game-save', {gameID: $gamePref.gameID, auto: auto, oppID: $gamePref.oppID});
    }
</script>

<div id="gameStatus">
	{#if $gamePref.finished == false}
		<h2 id="player">Playing: <i class="fa fa-circle" style="color:{$gamePref.currPlayer == $gamePref.side ? $currUser.gamePreferences.myColor : $currUser.gamePreferences.otherColor};"></i></h2>
	{/if}

	<h2 id="moves">Moves: {$gameBoard.numMoves}</h2>

	{#if $gamePref.finished == false}
		<h2 id="time">Timer: {$gamePref.timer}</h2>
	{/if}
</div>

<ThreeD currPos={currPos} nextPos={nextPos} />

{#if $gamePref.finished}
    <div id="state">
        <h2 id="rangeBar">Game State at Move: {$gameBoard.numMoves}</h2>
        <input class="custom-range" orient="vertical" on:change="{viewBoardHistory}" bind:value={rangeMoves} type="range" min="0" max="{$gameHistory.length - 1}" step="1">
    </div>
{:else}
    <div id="gameBtn" class="container">
        {#if $gamePref.paused && $gamePref.side == $gamePref.currPlayer && $gamePref.opp != null} 
            <button class="btn btn-success btn-lg start" on:click="{startGame}">Start Game</button>
        {/if}

        {#if $gamePref.side == $gamePref.currPlayer && $gameBoard.numMoves > 1}
            <button class="btn btn-warning btn-lg save" on:click="{() => saveGame(false)}">Save Game</button>

            <button class="btn btn-danger btn-lg forfeit" on:click="{() => saveGame(false)}">Forfeit Game</button>
        {/if}
    </div>
{/if}

<style> 

	.fa-circle {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		border-radius:50%;
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
		position:fixed;
		top:50%;
		right:7.5%;
	}

    .switch {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		position:fixed;
		top:25%;
		right:7.5%;
    }

    .save {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		position:fixed;
		top:50%;
		right:7.5%;
	}
	
	.forfeit {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		position:fixed;
		top:75%;
		right:7.5%;
	}
	
	#player {
		position:fixed;
		top:25%;
		left:7.5%;
	}

	#moves {
		position:fixed;
		top:50%;
		left:7.5%;
	}

	#time {
		position:fixed;
		top:75%;
		left:7.5%;
	}

	#state {
		position:fixed;
		top:25%;
		right:5%
	}

	#rangeBar {
		font-size:20px;
		text-align:center;
		margin-top:50%;
	}

	.custom-range {
        width:100%;
	}
	
	@media screen and (max-height: 800px) and (max-width: 1300px) {

        #gameStatus {
			width: calc((100% - 700px)/2);
			height:700px;
			top:calc((100% - 700px)/2);
			position:fixed;
			left:0;
		}

		#gameBtn {
			width: calc((100% - 700px)/2);
			height:700px;
			top:calc((100% - 700px)/2);
			position:fixed;
			right:0;
		}
    }

	@media screen and (max-width: 800px) {

        #gameStatus {
            width: 100%;
            height:unset;
            position:unset;
        }

        #player {
            font-size:20px;
			margin-top:0px;
			margin-left:-5px;
            margin-bottom:unset;
            text-align:center;
            width:33.33%;
			float:left;
			position:unset;
        }
        
        #time {
			font-size:20px;
            margin-top:0px;
            width:33.33%;
			margin-left:33.33%;
			position:unset;
        }

        #moves {
            float:right;
			font-size:20px;
            margin-top:0px;
            margin-bottom:unset;
            text-align:center;
			width:33.33%;
			position:unset;
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
            position:unset;
        }

        .start {
			margin-top:10px;
			width:50%;
			margin-left:25%;
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
			position:unset;
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