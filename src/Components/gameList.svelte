<script>
    import { userGames, gamePref, page, gameTab, currUser, 
            gameBoard, gameHistory, viewGameList, bigPopUp, currSocket, ratio, gameMoves } from '../Scripts/Init.js';
    import { Board } from '../Scripts/Board.js';
    import { getUserGames, localizeState, normalizeState } from '../Scripts/Functions.js';
    import { Game } from '../Scripts/Game.js';

    let currGame = $userGames.length > 0 ? $userGames[0] : null;

    function viewGameDetails(game) {
        if($ratio < 1) {
            let list = document.getElementById("gameList");
            let detail = document.getElementById("gameDetails");

            list.setAttribute("style", "left:-100%");
            detail.setAttribute("style", "left:0");
        }

        currGame = game;
    }

    function goBack() {
        let list = document.getElementById("gameList");
        let detail = document.getElementById("gameDetails");

        list.setAttribute("style", "left:0");
        detail.setAttribute("style", "left:100%");
    }

    async function getGame() {

        if($gameHistory.length > 0 && $gamePref == null) {

            let lastGame = [];

            for(let i = 0; i < $gameHistory.length; i++) {
                let { state, pieceId } = normalizeState($gameHistory[i]);
                lastGame.push({ board: state, move: $gameMoves[i], gameIds: pieceId });
            }

            if(navigator.onLine) {
                    
                let request = {
                    func: "saveUserGame",
                    lastGame: lastGame,
                    id: $currUser.profile.email
                }

                $currSocket.emit('save-game', request);
            } else {
                await localStorage.setItem('lastGame', JSON.stringify(lastGame));
            }
        }

        let flipped = false;

        gameMoves.set([]);
        gameHistory.set([]);
        
        let lastGameIndex = currGame.gameHistory.length - 1;

        let firstIds = currGame.gameHistory[0].gameIds

        if(firstIds[1] == 23 && currGame.priEmail == $currUser.profile.email)
            flipped = true;

        for(let i = 0; i < lastGameIndex + 1; i++) {

            if(currGame.gameHistory[i].move != null) {
                gameMoves.update(state => {
                    if(flipped) {
                        let move = currGame.gameHistory[i].move;
                        move = [7 - move[0], 7 - move[1], 7 - move[2], 7 - move[3]];
                        state.push(move);
                    } else {
                        state.push(currGame.gameHistory[i].move);
                    }
                    return state;
                });
            }

            gameHistory.update(state => {
                if(flipped)
                    state.push(new Board(localizeState(currGame.gameHistory[i].board.reverse(), currGame.gameHistory[i].gameIds.reverse(), i, flipped), null));
                else
                    state.push(new Board(localizeState(currGame.gameHistory[i].board, currGame.gameHistory[i].gameIds, i, flipped), null));
                return state;
			});
        }
        
        gameBoard.set(new Board($gameHistory[lastGameIndex], null));

        let initiator = currGame.priEmail == $currUser.profile.email ? true : false;

        currGame.side = currGame.priEmail == $currUser.profile.email ? 0 : 1;

        if(currGame.finished) 
            currGame.opp = currGame.priEmail == $currUser.profile.email ? currGame.secPlayer : currGame.priPlayer;

        gamePref.set(new Game(currGame, initiator));

        bigPopUp.set(false);
        viewGameList.set(false); 
        gameTab.set(5);
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
                    <button on:click="{() => viewGameDetails(game)}" class="btn btn-dark">{game.priPlayer == $currUser.profile.name ? "Me" : game.priPlayer.toUpperCase()} vs. {game.secPlayer == $currUser.profile.name ? "Me" : currGame.secPlayer.toUpperCase()}</button>
                {:else}
                    <button on:click="{() => viewGameDetails(game)}" class="btn btn-dark">{game.priPlayer == $currUser.profile.name ? "Me" : game.priPlayer.toUpperCase()} vs. {game.secPlayer == $currUser.profile.name ? "Me" : "Unknown Player"}</button>
                {/if}
            {/if}
        {/each}

        <h5>Finished Games</h5>
        {#each $userGames as game}
            {#if game.finished}
                <button on:click="{() => viewGameDetails(game)}" class="btn btn-dark">{game.priPlayer == $currUser.profile.name ? "Me" : game.priPlayer.toUpperCase()} vs. {game.secPlayer == $currUser.profile.name ? "Me" : game.secPlayer.toUpperCase()}</button>
            {/if}
        {/each}
    </div>
    <div id="gameDetails">
        {#if $ratio < 1}
            <button class="btn btn-dark" style="width:25%;" on:click="{goBack}"><i class="fa fa-arrow-left"></i> Back</button>
        {/if}
        {#if currGame.secPlayer != null}
            <h3 id="versus">{currGame.priPlayer == $currUser.profile.name ? "Me" : currGame.priPlayer.toUpperCase()} vs. {currGame.secPlayer == $currUser.profile.name ? "Me" : currGame.secPlayer.toUpperCase()}</h3>
        {:else}
            <h3 id="versus">{currGame.priPlayer == $currUser.profile.name ? "Me" : currGame.priPlayer.toUpperCase()} vs. {currGame.secPlayer == $currUser.profile.name ? "Me" : "Unknown Player"}</h3>
        {/if}
        <h4 class="detail">Date Started: <span>{currGame.date}</span></h4>
        <h4 class="detail">Status: <span>{currGame.finished == true ? "Finished" : "On-Going"}</span></h4>
        <h4 class="detail">Turn Time: <span>{currGame.time} seconds</span></h4>
        <h4 class="detail">Total Moves: <span>{currGame.priMoves + currGame.secMoves}</span></h4>
        <h4 class="detail">My Moves: <span>{currGame.priPlayer == $currUser.name ? currGame.priMoves : currGame.secMoves}</span></h4>
        <h4 class="detail">Minutes Played: <span>{currGame.minutesPlayed} minutes</span></h4>
        
        {#if currGame.finished == false}
            <h4 class="detail">Current Player: <span>{currGame.currPlayer == "red" && currGame.priEmail == $currUser.profile.email ? "You" : currGame.secPlayer.toUpperCase()} </span></h4>
        {:else}
            <h4 class="detail">Winner: <span>{currGame.winner}</span></h4>
        {/if}

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
            width:100%;
            height:100%;
            float:unset;
            color:white;
            position:fixed;
            left:0;
            top:0;
            transition: ease-in-out 1s;
        }

        #gameDetails {
            width:100%;
            height:100%;
            float: unset;
            border-left: none;
            left:100%;
            top:0;
            position:fixed;
            transition: ease-in-out 1s;
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