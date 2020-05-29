<script>
    import { userGames, gamePref, page, gameTab, currUser, gameBoard, gameHistory, gameChat } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';

    function resumeGame(game) {

        if(game.priGameHistory.length > 0 || game.secGameHistory.length > 0) {

            let gameStates = game.priEmail == $currUser.email ? game.priGameHistory : game.secGameHistory;

            console.log(gameStates[gameStates.length - 1]);

            gameBoard.set(new Board(gameStates[gameStates.length - 1], null));

            $gameHistory.set(gameStates);

        } else {

            if(game.priEmail == $currUser.email) {

                gameBoard.set(new Board(null, false));

                $gameHistory.push($gameBoard.saveBoardState());
            } 

            if(game.secEmail == $currUser.email) {

                gameBoard.set(new Board(null, true));

                $gameHistory.push($gameBoard.saveBoardState());
            }
        }

        gameChat.set(game.chatHistory);

        gamePref.update(state => {
            state = {};
            state.id = game.id;
            state.time = game.time;
            state.timer = game.time;
            state.pri = game.priPlayer;
            state.sec = game.secPlayer;
            state.currPlayer = game.currPlayer;
            state.numMoves = game.priEmail == $currUser.email ? game.priGameHistory.length : game.secGameHistory.length;
            state.rangeMoves = game.priEmail == $currUser.email ? game.priGameHistory.length : game.secGameHistory.length;
            state.paused = true;
            state.finished = false;
            state.side = game.priEmail == $currUser.email ? "red" : "black";
            state.secondsPlayed = game.minutesPlayed * 60;
            return state;
        });

        page.set(1); gameTab.set(0);
    }

    function reviewGame(game) {

        let gameStates = game.priEmail == $currUser.email ? game.priGameHistory : game.secGameHistory;

        gameBoard.set(new Board(gameStates[gameStates.length - 1], null));

        $gameHistory.set(gameStates);

        gameChat.set(game.chatHistory);

        gamePref.update(state => {
            state = {};
            state.id = game.id;
            state.time = game.time;
            state.timer = game.time;
            state.pri = game.priPlayer;
            state.sec = game.secPlayer;
            state.currPlayer = game.currPlayer;
            state.numMoves = game.priEmail == $currUser.email ? game.priGameHistory.length : game.secGameHistory.length;
            state.rangeMoves = game.priEmail == $currUser.email ? game.priGameHistory.length : game.secGameHistory.length;
            state.paused = false;
            state.finished = true;
            state.side = game.priEmail == $currUser.email ? "red" : "black";
            state.secondsPlayed = game.minutesPlayed * 60;
            return state;
        });

        page.set(1); gameTab.set(0);
    }
</script>

{#if $userGames.length == 0}
    <h5 id="empty">There are no games to view</h5>
    <h5>Create or Join a Game</h5>
{:else}
    <h5>On-Going Games</h5>
    {#each $userGames as game}
        {#if !game.finished}
            <button on:click="{() => resumeGame(game)}" class="btn btn-warning">{game.priPlayer} vs. {game.secPlayer} - {game.date}</button>
        {/if}
    {/each}

    <h5>Finished Games</h5>
    {#each $userGames as game}
        {#if game.finished}
            <button on:click="{() => reviewGame(game)}" class="btn btn-light">{game.priPlayer} vs. {game.secPlayer} - {game.date}</button>
        {/if}
    {/each}
{/if}

<style>
    h5 {
        text-align: center;
        margin-top:20px;
    }

    button {
        width:100%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-bottom: 10px;
    }

    #empty {
        margin-top: 45%;
    }
</style>