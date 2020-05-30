<script>
    import { userGames, gamePref, page, gameTab, currUser, gameBoard, gameHistory, gameChat } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';

    function getGame(game, resume) {

        let gameStates = game.priEmail == $currUser.email ? JSON.parse(game.priGameHistory) : JSON.parse(game.secGameHistory);

        gameBoard.set(new Board(gameStates[gameStates.length - 1], null));

        gameHistory.set(gameStates);

        gameChat.set(JSON.parse(game.chatHistory));

        gamePref.update(state => {
            state = {};
            state.id = game.id;
            state.time = game.time;
            state.timer = game.time;
            state.pri = game.priEmail == $currUser.email ? $currUser.name : null;
            state.sec = game.secEmail == $currUser.email ? $currUser.name : null;
            state.currPlayer = game.currPlayer;
            state.numMoves = gameStates.length;
            state.rangeMoves = gameStates.length;
            state.paused = resume == true ? true : false;
            state.finished = resume == true ? false : true;
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
            <button on:click="{() => getGame(game, true)}" class="btn btn-warning">{game.priPlayer} vs. {game.secPlayer} - {game.date}</button>
        {/if}
    {/each}

    <h5>Finished Games</h5>
    {#each $userGames as game}
        {#if game.finished}
            <button on:click="{() => getGame(game, false)}" class="btn btn-light">{game.priPlayer} vs. {game.secPlayer} - {game.date}</button>
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