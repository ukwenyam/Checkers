<script>
    import { userGames, gamePref, page, gameTab, currUser, 
            gameBoard, gameHistory, gameChat, viewGameList, bigPopUp } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';

    let currGame = $userGames[0];

    function viewGameDetails(index) {
        currGame = $userGames[index];
    }

    function getGame() {

        let gameStates = game.priEmail == $currUser.email ? currGame.priGameHistory : currGame.secGameHistory;

        gameBoard.set(new Board(gameStates[gameStates.length - 1], null));

        gameHistory.set(gameStates);

        gamePref.update(state => {
            state = {};
            state.id = currGame.id;
            state.time = currGame.time;
            state.timer = currGame.time;
            state.pri = currGame.priEmail == $currUser.email ? $currUser.name : null;
            state.sec = currGame.secEmail == $currUser.email ? $currUser.name : null;
            state.currPlayer = currGame.currPlayer;
            state.numMoves = gameStates.length;
            state.rangeMoves = gameStates.length;
            state.paused = resume == true ? true : false;
            state.finished = currGame.finished;
            state.side = currGame.priEmail == $currUser.email ? "red" : "black";
            state.secondsPlayed = currGame.minutesPlayed * 60;
            return state;
        });

        bigPopUp.set(false);
        viewGameList.set(false); 
        gameTab.set(0);
    }
</script>

{#if $userGames.length == 0}
    <h5 class="empty" style="margin-top:25%;">There are no games to view</h5>
    <h5 class="empty">Create or Join a Game</h5>
{:else}
    <div id="gameList" class="container-fluid">
         <h5>On-Going Games</h5>
        {#each $userGames as game, i}
            {#if !game.finished}
                <button on:click="{() => viewGameDetails(i)}" class="btn btn-dark">{game.priPlayer == $currUser.name ? "Me" : game.priPlayer.toUpperCase()} vs. {game.secPlayer == $currUser.name ? "Me" : game.secPlayer.toUpperCase()}</button>
            {/if}
        {/each}

        <h5>Finished Games</h5>
        {#each $userGames as game, i}
            {#if game.finished}
                <button on:click="{() => viewGameDetails(i)}" class="btn btn-dark">{game.priPlayer == $currUser.name ? "Me" : game.priPlayer.toUpperCase()} vs. {game.secPlayer == $currUser.name ? "Me" : game.secPlayer.toUpperCase()}</button>
            {/if}
        {/each}
    </div>
    <div id="gameDetails">
        <h3 id="versus">{currGame.priPlayer == $currUser.name ? "Me" : currGame.priPlayer.toUpperCase()} vs. {currGame.secPlayer == $currUser.name ? "Me" : currGame.secPlayer.toUpperCase()}</h3>
        <h4 class="detail">Date Started: <span>{currGame.date}</span></h4>
        <h4 class="detail">Status: <span>{currGame.finished == false ? "On-Going" : "Finished"}</span></h4>
        <h4 class="detail">Turn Time: <span>{currGame.time} seconds</span></h4>
        <h4 class="detail">Total Moves: <span>{currGame.priEmail == $currUser.email ? currGame.priGameHistory.length : currGame.secGameHistory.length}</span></h4>
        <h4 class="detail">Minutes Played: <span>{currGame.minutesPlayed} minutes</span></h4>
        <h4 class="detail">Current Player: <span>{currGame.currPlayer == "red" && currGame.priEmail == $currUser.email ? "You" : currGame.secPlayer.toUpperCase()} </span></h4>

        <button id="getGame" on:click="{getGame}" class="{currGame.finished == true ? "btn btn-primary" : "btn- btn-warning"}">{currGame.finished == true ? "Review Game" : "Resume Game"}</button>
    </div>
{/if}

<style>
    #gameList {
        width:33.33%;
        float:left;
        color:white;
    }

    .detail {
        margin-top: 10%;
    }

    span {
        font-weight:lighter;
    }

    #getGame {
        width: 50%;
        border-radius: 0.4rem;
        margin-left:25%;
        position: absolute;
        bottom:10px;
    }

    #gameDetails {
        width:66.66%;
        float: right;
        color:white;
        position:relative;
        height:100%;
        border-left: 1px solid white;
    }

    h4 {
        text-align: center;
    }

    h3 {
        text-align: center;
        margin-top:20px;
    }

    h5 {
        text-align: center;
        margin-top:20px;
    }

    button {
        width:100%;
        margin-bottom: 10px;
    }

    .empty {
        color:white;
    }
</style>