<script>
    import { currUser, gameBoard, gameHistory, gamePref, page, gameTab, viewCreateGame, smallPopUp } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { Board } from '../Scripts/Board.js';
    import { Game } from '../Scripts/Game.js';
    import Loader from './loader.svelte';

    let Time = 15;

    let request;

    let loading = false;

    let screenWidth = screen.width;

    function selectTime(time) {
        Time = time;
    }

    function createGame() {

        loading = true;

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

                let game = response.msg;
                game.time = Time;
                game.side = "red";
                game.name = $currUser.name;
                game.email = $currUser.email;

                gameBoard.set(new Board(null, false));

                gamePref.set(new Game(game, $gameBoard.saveBoardState(), true));

                loading = false;
            } else {
                loading = false;
                console.log(response.err);
            }

        }).catch((error) => {
            loading = false;
            console.log(error);
        });
    }

    function goBack() {
        let index = document.getElementById("index");
		index.setAttribute("style", "left:0");

		let create = document.getElementById("create");
		create.setAttribute("style", "left:100%;");
    }
</script>

{#if $gamePref == null}
    {#if screenWidth <= 800}
        <button id="backBtn" class="btn btn-dark" on:click="{goBack}"><i class="fa fa-arrow-left"></i>  Back</button>
    {/if}
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
{:else}
    <h5 style="text-align:center;margin-top:50%;">Please share Game Password '{$gamePref.gameID}' with other player</h5>
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

    @media screen and (max-width: 800px) {

        .custom-range {
            width:90%;
            margin-left:5%;
        }

        button {
            margin-top:40px;
        }

        #backBtn {
            margin-top:0;
            float:left;
            box-shadow:none;
            margin-left:0;
            width:25%;
        }
    }
</style>