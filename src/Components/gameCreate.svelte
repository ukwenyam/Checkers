<script>
    import { currUser, gameBoard, gameHistory, gamePref, page, gameTab, viewCreateGame, smallPopUp } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { Board } from '../Scripts/Board.js';
    import Loader from './loader.svelte';

    let Time = 15;

    let request;

    let loading = false;

    function selectTime(time) {
        Time = time;
    }

    function createGame() {

        loading = true;

        gameBoard.set(new Board(null, false));

        $gameHistory.push($gameBoard.saveBoardState());

        request = {
            func: "createGame",
            email: $currUser.email,
            name: $currUser.name,
            time: Time,
            date: moment().format("YYYY-MM-DD")
        }

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

<div id="suggest">
    <h6>Time Per Turn (seconds)</h6>

    <div class="form-check form-check-inline">
        <input on:change="{() => selectTime(15)}" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1">
        <label class="form-check-label" for="inlineRadio1">15</label>
    </div>

    <div class="form-check form-check-inline">
        <input on:change="{() => selectTime(30)}" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2">
        <label class="form-check-label" for="inlineRadio2">30</label>
    </div>

    <div class="form-check form-check-inline">
        <input on:change="{() => selectTime(45)}" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3">
        <label class="form-check-label" for="inlineRadio3">45</label>
    </div>

    <div class="form-check form-check-inline">
        <input on:change="{() => selectTime(60)}" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3">
        <label class="form-check-label" for="inlineRadio3">60</label>
    </div>
</div>

<h6>{Time} seconds</h6>
<input class="custom-range" bind:value="{Time}" type="range" min="15" max="60" step="1">

{#if loading}
    <Loader/>
{:else}
    <button class="btn btn-primary" on:click="{createGame}">Create</button>
{/if}

<style>
    #suggest {
        color:white;
        margin-top:12.5%;
        width:100%;
        margin-bottom:12.5%;
    }

    .form-check {
        margin-left:10%;
    }

    h5 {
        text-align: center;
        margin-top:20px;
        color: white;
    }

    h6 {
        color:white;
        text-align:center;
    }

    button {
        border-radius:0.4rem;
        width:50%;
        margin-left:25%;
        margin-top:20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>