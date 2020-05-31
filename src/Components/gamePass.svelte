<script>
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { currSocket, currUser, gameBoard, gameHistory, gamePref, page, gameTab } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';

    let gamePassword;

    let request;

    function joinGame() {

        if(gamePassword != null) {

            request = {
                func: "joinGame",
                gameID: gamePassword,
                email: $currUser.email,
                name: $currUser.name
            }

            invokeFunction(request).then((response) => {
                if(response.msg != null) {
                    console.log(response.msg);

                    let game = response.msg;

                    if(game.priEmail != $currUser.email) {

                        gameBoard.set(new Board(null, true));

                        $gameHistory.push($gameBoard.saveBoardState());

                        gamePref.update(state => {
                            state = {};
                            state.time = game.time;
                            state.timer = game.time;
                            state.id = gamePassword;
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

                        page.set(1); gameTab.set(0);
                    } else {
                        console.log("Same Player");
                    }

                } else {
                    console.log(response.err);
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }
</script>

<h5>Game Password</h5>

<input bind:value="{gamePassword}" placeholder="Game Password" on:keydown="{event => event.which === 13 && joinGame()}" required/>

<button class="btn btn-primary" style="margin-bottom:30px;" on:click="{joinGame}">Join</button>

<hr/>

<button class="btn btn-primary">Find A Random Game</button>

<style>
    h5 {
        text-align: center;
        margin-top:20px;
    }

    input {
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width:100%;
        margin-top:20px;
        text-align: center;
    }

    button {
        width:50%;
        margin-left:25%;
        margin-top:30px;
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>