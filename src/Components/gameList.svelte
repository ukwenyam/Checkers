<script>
    import { userGames, gamePref, page, gameTab, currUser, 
            gameBoard, gameHistory, viewGameList, bigPopUp } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';
    import { getUserGames } from '../Scripts/Functions.js';

    let currGame = $userGames.length > 0 ? $userGames[0] : null;

    let screenWidth = screen.width;

    function viewGameDetails(game) {
        if(screen.width <= 800) {
            let list = document.getElementById("gameList");
            let detail = document.getElementById("gameDetails");

            list.setAttribute("style", "display:none");
            detail.setAttribute("style", "display:block");
        }

        currGame = game;
    }

    function goBack() {
        let list = document.getElementById("gameList");
        let detail = document.getElementById("gameDetails");

        list.setAttribute("style", "display:block");
        detail.setAttribute("style", "display:none");
    }

    function getGame() {

        if(currGame.finished) {
            gameBoard.set(new Board(currGame.gameHistory[currGame.gameHistory.length - 1], null));
        } else {
            gameBoard.set(new Board(currGame.gameHistory, null));
        }

        gameHistory.set(currGame.gameHistory);

        gamePref.update(state => {
            state = {};
            state.id = currGame._id;
            state.time = currGame.time;
            state.timer = currGame.time;
            state.pri = currGame.priEmail == $currUser.email ? $currUser.name : null;
            state.sec = currGame.secEmail == $currUser.email ? $currUser.name : null;
            state.currPlayer = currGame.currPlayer;
            state.numMoves = currGame.finished == true ? currGame.gameHistory.length - 1 : currGame.numMoves;
            state.rangeMoves = currGame.finished == true ? currGame.gameHistory.length - 1 : currGame.numMoves;
            state.priMoves = currGame.priMoves,
            state.secMoves = currGame.secMoves,
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
        {#each $userGames as game}
            {#if !game.finished}
                {#if game.secPlayer != null}
                    <button on:click="{() => viewGameDetails(game)}" class="btn btn-dark">{game.priPlayer == $currUser.name ? "Me" : game.priPlayer.toUpperCase()} vs. {game.secPlayer == $currUser.name ? "Me" : "Unknown Player"}</button>
                {:else}
                    <button on:click="{() => viewGameDetails(game)}" class="btn btn-dark">{game.priPlayer == $currUser.name ? "Me" : game.priPlayer.toUpperCase()} vs. {game.secPlayer == $currUser.name ? "Me" : "Unknown Player"}</button>
                {/if}
            {/if}
        {/each}

        <h5>Finished Games</h5>
        {#each $userGames as game}
            {#if game.finished}
                <button on:click="{() => viewGameDetails(game)}" class="btn btn-dark">{game.priPlayer == $currUser.name ? "Me" : game.priPlayer.toUpperCase()} vs. {game.secPlayer == $currUser.name ? "Me" : game.secPlayer.toUpperCase()}</button>
            {/if}
        {/each}
    </div>
    <div id="gameDetails">
        {#if screenWidth <= 800}
            <button class="btn btn-dark" style="width:25%;" on:click="{goBack}"><i class="fa fa-arrow-left"></i> Back</button>
        {/if}
        {#if currGame.secPlayer != null}
            <h3 id="versus">{currGame.priPlayer == $currUser.name ? "Me" : currGame.priPlayer.toUpperCase()} vs. {currGame.secPlayer == $currUser.name ? "Me" : "Unknown Player"}</h3>
        {:else}
            <h3 id="versus">{currGame.priPlayer == $currUser.name ? "Me" : currGame.priPlayer.toUpperCase()} vs. {currGame.secPlayer == $currUser.name ? "Me" : "Unknown Player"}</h3>
        {/if}
        <h4 class="detail">Date Started: <span>{currGame.date}</span></h4>
        <h4 class="detail">Status: <span>{currGame.finished == true ? "Finished" : "On-Going"}</span></h4>
        <h4 class="detail">Turn Time: <span>{currGame.time} seconds</span></h4>
        <h4 class="detail">Total Moves: <span>{currGame.finished == true ? currGame.gameHistory.length - 1 : currGame.numMoves}</span></h4>
        <h4 class="detail">My Moves: <span>{currGame.priPlayer == $currUser.name ? currGame.priMoves : currGame.secMoves}</span></h4>
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
        overflow-y: auto;
    }

    .detail {
        margin-top: 8%;
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
        overflow-y: auto;
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

    @media screen and (max-width: 800px) {

        #gameList {
            width:101%;
            float:unset;
            color:white;
            display:block;
        }

        #gameDetails {
            width:101%;
            float: unset;
            border-left: none;
            display:none;
        }

        #getGame {
            width: 50%;
            border-radius:0px;
            margin-left:25%;
            margin-top:20px;
            position: unset;
            bottom:unset;
        }

        .detail {
            font-size:20px;
        }
    }
</style>