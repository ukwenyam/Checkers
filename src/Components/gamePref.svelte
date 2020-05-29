<script>
    import { currUser, gameBoard, gameHistory, gamePref, page, gameTab } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { Board } from '../Scripts/Board.js';

    let Time = 15;

    let request;

    function createGame() {

        gameBoard.set(new Board(null, false));

        $gameHistory.push($gameBoard.saveBoardState());

        gamePref.update(state => {
            state = {};
            state.time = Time;
            state.timer = Time;
            state.pri = $currUser.name;
            state.sec = null;
            state.currPlayer = null;
            state.numMoves = 0;
            state.rangeMoves = 0;
            state.paused = true;
            state.finished = false;
            state.side = "red";
            state.secondsPlayed = 0;
            return state;
        });

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
                    state.id = response.msg;
                    return state;
                });

                page.set(1); gameTab.set(0);
            } else {
                console.log(response.err);
            }

        }).catch((error) => {
            console.log(error);
        });
    }
</script>

<h5>Game Preferences</h5>

<h6>Time Per Turn: {Time} seconds</h6>
<input class="custom-range" bind:value="{Time}" type="range" min="15" max="60" step="1">

<button class="btn btn-primary" on:click="{createGame}">Create</button>

<style>
    h5 {
        text-align: center;
        margin-top:20px;
    }

    h6 {
        margin-top:20px;
    }

    button {
        border-radius:0.4rem;
        width:50%;
        margin-left:25%;
        margin-top:80px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>