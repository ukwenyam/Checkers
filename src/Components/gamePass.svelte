<script>
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { currUser, gameBoard, gameHistory, gamePref, page } from '../Scripts/Init.js';
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

                    gameBoard.update(state => {
                        state = new Board(null, true);
                        console.log(state);
                        return state;
                    });

                    gameHistory.update(state => {
                        state.push($gameBoard.saveBoardState());
                        return state;
                    });

                    gamePref.update(state => {
                        state = {};
                        state.time = game.time;
                        state.id = gamePassword;
                        state.pri = game.priPlayer;
                        state.sec = game.secPlayer;
                        return state;
                    });

                    page.set(1);

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

<input bind:value="{gamePassword}" placeholder="Game Password"/>

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
    }

    button {
        width:50%;
        margin-left:25%;
        margin-top:30px;
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>