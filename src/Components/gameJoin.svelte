<script>
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { currSocket, currUser, gameBoard, gameHistory, gamePref, page, gameTab, viewJoinGame, smallPopUp } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';
    import Loader from './loader.svelte';
    import { Game } from '../Scripts/Game.js';
    import { getAllChats } from '../Scripts/Functions.js';

    let gamePassword;

    let request;

    let screenWidth = screen.width;

    let viewError = false, errMsg;

    let loading = false;

    function joinGame() {

        if(gamePassword != null) {

            loading = true;

            request = {
                func: "joinGame",
                gameID: gamePassword,
                email: $currUser.email,
                name: $currUser.name
            }

            invokeFunction(request).then((response) => {
                console.log(response);
                if(response.msg != null) {
                    let game = response.msg;
                    if(game.priEmail != $currUser.email) {
                        game.name = $currUser.name;
                        game.email = $currUser.email;
                        game.side = "black";

                        gameBoard.set(new Board(null, true));
                        gamePref.set(new Game(game, $gameBoard.saveBoardState(), false));

                        loading = false;
                        smallPopUp.set(false);
                        viewJoinGame.set(false);
                        gameTab.set(2);
                    } else {
                        loading = false;
                        errMsg = "Cannot Join A Game You Created";
                        viewError = true;
                        deleteGame(gamePassword);
                    }
                } else {
                    loading = false;
                    console.log(response.err);
                }
            }).catch((error) => {
                loading = false;
                console.log(error);
            });
        }
    }

    function deleteGame(gameID) {

        request = {
            func: "deleteGame",
            gameID: gameID
        }

        invokeFunction(request).then((response) => {
            console.log(response);

            if(response.msg == "SUCCESS") {
                console.log("Game deleted successfully");
            } else {
                console.log(response.err);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    function goBack() {
        let index = document.getElementById("index");
		index.setAttribute("style", "left:0");

		let join = document.getElementById("join");
		join.setAttribute("style", "left:-100%;");
    }
</script>

{#if screenWidth <= 800}
    <button id="backBtn" class="btn btn-dark" on:click="{goBack}">Back <i class="fa fa-arrow-right"></i></button>
{/if}

<h5>Game Password</h5>

{#if viewError}
    <h6 style="text-align:center;color:red;margin-top:20px;">{errMsg}</h6>
{/if}

<input bind:value="{gamePassword}" placeholder="Game Password" on:keydown="{event => event.which === 13 && joinGame()}" required/>

{#if loading}
    <Loader/>
{:else}
    <button class="btn btn-primary" style="margin-bottom:30px;" on:click="{joinGame}">Join</button>
{/if}

<style>
    h5 {
        text-align: center;
        margin-top:20px;
        color:white;
    }

    input {
        border-radius:0.4rem;
        width:100%;
        margin-top:25%;
        text-align: center;
        outline:none;
        background: black;
        border:none;
        color:white;
    }

    button {
        width:50%;
        margin-left:25%;
        margin-top:30px;
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    @media screen and (max-width: 800px) {

        input {
            width:80%;
            margin-left:10%;
        }

        #backBtn {
            margin-top:0;
            float:right;
            box-shadow:none;
            margin-left:75%;
            width:25%;
        }
    }
</style>