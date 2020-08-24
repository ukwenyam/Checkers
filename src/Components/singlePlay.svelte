<script>
	import { Position } from '../Scripts/Position.js';
	import ThreeD from './threeD.svelte';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { invokeFunction } from '../Scripts/Cloud.js';
	import { fly, fade } from 'svelte/transition';
	import Blur from './blurScreen.svelte';
	import { normalizeState, localizeState } from '../Scripts/Functions';
    import { gameBoard, gameHistory, gamePref, currSocket, currUser, page, gameTab, gameMoves, ratio } from '../Scripts/Init.js';

	let rangeMoves = 0, numMoves = 0;

	gameBoard.set(new Board(null, false));

	let checkLogin = setInterval(function() {
		if($currUser != null && $currUser.isAuth) {
			if($currUser.lastGame.length > 0) 
				setLastGame();
			clearInterval(checkLogin);
		}
	}, 2000);
	
	let currPos, nextPos;

	let screenWidth = screen.width;

	let onlineStatus = navigator.onLine;

	function setLastGame() {

		gameMoves.set([]);
		gameHistory.set([]);

		let lastGameIndex = $currUser.lastGame.length - 1;

		for(let i = 0; i < lastGameIndex + 1; i++) {

			gameMoves.update(state => {
                state.push($currUser.lastGame[i].move);
                return state;
            });

            gameHistory.update(state => {
                state.push(new Board(localizeState($currUser.lastGame[i].board, $currUser.lastGame[i].gameIds, i, false), null));
                return state;
			});
		}

		gameBoard.set(new Board($gameHistory[lastGameIndex], null));

		rangeMoves = $gameMoves.length - 1, numMoves = $gameMoves.length - 1;	
	}

	function viewBoardHistory() {
		gameBoard.set(new Board($gameHistory[rangeMoves], null));
	}

    setInterval(function() {
        if(rangeMoves == numMoves) {
			//saveGame(true);
			rangeMoves = $gameBoard.numMoves;
			numMoves = $gameBoard.numMoves;
		}

		onlineStatus = navigator.onLine;
    }, 2000);

    async function saveGame(auto) {

		let lastGame = [];

		for(let i = 0; i < $gameHistory.length; i++) {
			let { state, pieceId } = normalizeState($gameHistory[i]);
			lastGame.push({ board: state, move: $gameMoves[i], gameIds: pieceId });
		}

		if(navigator.onLine) {
				
			let request = {
				func: "saveUserGame",
				lastGame: lastGame,
				id: $currUser.profile.email
			}

			$currSocket.emit('save-game', request);
		} else {
			await localStorage.setItem('lastGame', JSON.stringify(lastGame));
		}
	}

	function viewEntry() {
		gameTab.set(0);

		setTimeout(function() {
			let index = document.getElementById("index");
			index.setAttribute("style", "top:100%;");

			let enter = document.getElementById("enter");
			enter.setAttribute("style", "top:0;");
		}, 500);
	}
</script>

<div id="gameStatus">
	<h2 id="moves">Moves: {numMoves}</h2>
</div>

<ThreeD currPos={currPos} nextPos={nextPos} rangeMoves={rangeMoves} numMoves={numMoves} />

<div id="gameBtn" class="container">
	{#if $currUser == null && screenWidth <= 800}
		<button class="btn btn-primary btn-lg login" on:click="{viewEntry}">Login/Register <i class="fa fa-sign-in"></i></button>
	{/if}

	{#if $currUser != null && numMoves > 1 && onlineStatus}
		<button class="btn btn-secondary btn-lg forfeit" on:click="{() => saveGame(false)}">Save Game</button>
	{/if}
	
	<div id="state">
		<h2 id="rangeBar">Game State at Move: {rangeMoves}</h2>
		<input class="custom-range" orient="vertical" on:change="{viewBoardHistory}" bind:value={rangeMoves} type="range" min="0" max="{numMoves}" step="1">
	</div>
</div>

<style>
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
	
	.forfeit {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		position:fixed;
		right:7.5%;
		top:75%;
	}
	
	#moves {
		position:fixed;
		top:33.33%;
		margin-left:7.5%;
	}

	#state {
		position:fixed;
		top:25%;
		right:5%;
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


        #moves {
			font-size:20px;
            margin-top:0px;
            text-align:center;
			width:100%;
			position:unset;
			float:right;
        }
        
        #gameBtn {
            width: 100%;
            height:unset;
            top:unset;
            position:unset;
            right:unset;
        }

        #state {
			width:100%;
			text-align: center;
			margin-top:-37.5%;
			position:unset;
        }

        .forfeit {
            margin-top:20px;
            margin-left:25%;
            position:unset;
            width:50%;
		}
		
		.login {
			box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
			margin-top:20px;
			width:50%;
			margin-left:25%;
		}
    }
</style>