<script>
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { currSocket, currUser, gameBoard, gameHistory, gamePref, page, gameTab, gameChat, viewJoinGame, smallPopUp } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';
    import Loader from './loader.svelte';

    let gamePassword;

    let request;

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

                    let game = response.msg.game;

                    if(game.priEmail != $currUser.email) {

                        gameBoard.set(new Board(null, true));

                        $gameHistory.push($gameBoard.saveBoardState());

                        gameChat.set(response.msg.chat.history);

                        gamePref.update(state => {
                            state = {};
                            state.time = game.time;
                            state.timer = game.time;
                            state.gameID = gamePassword;
                            state.chatID = response.msg.chat.id;
                            state.pri = null;
                            state.sec = game.secPlayer;
                            state.currPlayer = null;
                            state.numMoves = 0;
                            state.rangeMoves = 0;
                            state.paused = true;
                            state.finished = false;
                            state.side = "black";
                            state.secondsPlayed = 0;
                            return state;
                        });

                        loading = false;
                        smallPopUp.set(false);
                        viewJoinGame.set(false)
                        gameTab.set(0);
                    } else {
                        loading = false;
                        errMsg = "Cannot Join A Game You Created";
                        viewError = true;
                        deleteGame(gamePassword, response.msg.chat.id);
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

    function deleteGame(gameID, chatID) {

        request = {
            func: "deleteGame",
            gameID: gameID,
            chatID: chatID
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
</script>

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
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width:100%;
        margin-top:25%;
        text-align: center;
        outline:none;
    }

    button {
        width:50%;
        margin-left:25%;
        margin-top:30px;
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>