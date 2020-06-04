<script>
    import { currUser, gameBoard, gameHistory, gamePref, page, gameTab, viewCreateGame, smallPopUp } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { Board } from '../Scripts/Board.js';
    import Loader from './loader.svelte';

    let Time = 15;

    let request;

    let loading = false;

    function createGame() {

        loading = true;

        gameBoard.set(new Board(null, false));

        $gameHistory.push($gameBoard.saveBoardState());

        request = {
            func: "createGame",
            email: $currUser.email,
            name: $currUser.name,
            time: Time,
            date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() 
        }

        console.log(request);

        invokeFunction(request).then((response) => {

            console.log(response);
            
            if(response.msg != null) {

                console.log(response.msg);

                gamePref.update(state => {
                    state = {};
                    state.gameID = response.msg;
                    state.time = Time;
                    state.timer = Time;
                    state.pri = $currUser.name;
                    state.sec = null;
                    state.chatID = null;
                    state.currPlayer = null;
                    state.numMoves = 0;
                    state.rangeMoves = 0;
                    state.paused = true;
                    state.finished = false;
                    state.side = "red";
                    state.secondsPlayed = 0;
                    return state;
                });

                loading = false;
                smallPopUp.set(false);
                viewCreateGame.set(false);
                gameTab.set(0);
            } else {
                loading = false;
                console.log(response.err);
            }

        }).catch((error) => {
            loading = false;
            console.log(error);
        });
    }
</script>

<h5>Game Preferences</h5>

<h6>Time Per Turn: {Time} seconds</h6>
<input class="custom-range" bind:value="{Time}" type="range" min="15" max="60" step="1">

{#if loading}
    <Loader/>
{:else}
    <button class="btn btn-primary" on:click="{createGame}">Create</button>
{/if}

<style>
    h5 {
        text-align: center;
        margin-top:20px;
        color: white;
    }

    h6 {
        margin-top:25%;
        color:white;
    }

    button {
        border-radius:0.4rem;
        width:50%;
        margin-left:25%;
        margin-top:20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>