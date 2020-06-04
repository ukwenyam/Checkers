<script>
    import { userGames, gamePref, page, gameTab, currUser, gameBoard, gameHistory, gameChat } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';

    function getGame(game, resume) {

        let gameStates = game.priEmail == $currUser.email ? JSON.parse(game.priGameHistory) : JSON.parse(game.secGameHistory);

        gameBoard.set(new Board(gameStates[gameStates.length - 1], null));

        gameHistory.set(gameStates);

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
    <h5 class="empty" style="margin-top:25%;">There are no games to view</h5>
    <h5 class="empty">Create or Join a Game</h5>
{:else}
    <div id="gameList">
         <h5>On-Going Games</h5>
        {#each $userGames as game}
            {#if !game.finished}
                <button on:click="{() => getGame(game, true)}" class="btn btn-warning">{game.priPlayer == $currUser.name ? "You" : game.priPlayer} vs. {game.secPlayer == $currUser.name ? "You" : game.secPlayer} - {game.date}</button>
            {/if}
        {/each}

        <h5>Finished Games</h5>
        {#each $userGames as game}
            {#if game.finished}
                <button on:click="{() => getGame(game, false)}" class="btn btn-light">{game.priPlayer == $currUser.name ? "You" : game.priPlayer} vs. {game.secPlayer == $currUser.name ? "You" : game.secPlayer} - {game.date}</button>
            {/if}
        {/each}
    </div>
    <div id="gameDetails">

    </div>
{/if}

<style>
    #gameList {
        width:33.33%;
        float:left;
        color:white;
        border-right: 1px solid white;
    }

    #gameDetails {
        width:66.66%;
        float: right;
        color:white;
        border-left: 1px solid white;
    }

    h5 {
        text-align: center;
        margin-top:20px;
    }

    button {
        width:100%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-bottom: 10px;
    }

    .empty {
        color:white;
    }
</style>