<script>
    import { currUser, page, userGames, leaderBoard } from '../Scripts/Init.js';
</script>

<div id="stats" class="container-fluid">
    <h5>My Stats</h5>
    <hr/>

    <table id="statsTable">
        <tr>
            <th style="text-align:left;">League Position</th>
            <td>{$currUser.position}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Total Points</th>
            <td>{$currUser.totalPoints}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Wins</th>
            <td>{$currUser.wins}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Draws</th>
            <td>{$currUser.draws}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Losses</th>
            <td>{$currUser.losses}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Games Played</th>
            <td>{$currUser.gamesPlayed}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Total Moves</th>
            <td>{$currUser.gamesPlayed}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Avg. Moves Per Game</th>
            <td>{$currUser.avgMovesPerGame}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Most Moves</th>
            <td>{$currUser.mostMoves}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Least Moves</th>
            <td>{$currUser.leastMoves}</td>
        </tr>
        <tr>
            <th style="text-align:left;">Total Time Played</th>
            <td>{$currUser.totalTimePlayed} minutes</td>
        </tr>
        <tr>
            <th style="text-align:left;">Avg. Time Played Per Game</th>
            <td>{$currUser.avgTimePlayPerGame} minutes</td>
        </tr>
        <tr>
            <th style="text-align:left;">Least Time Played</th>
            <td>{$currUser.leastTimePlayed} minutes</td>
        </tr>
        <tr>
            <th style="text-align:left;">Most Time Played</th>
            <td>{$currUser.mostTimePlayed} minutes</td>
        </tr>
    </table>
</div>

<div id="league" class="container-fluid">
    <h5>Checkas League - Top 50</h5>
    <hr/>

    <h6 style="text-align:center;margin-top:10px;margin-bottom:10px;">League Position - #{$currUser.position}</h6>

    <table>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Games</th>
            <th>Wins</th>
            <th>Draws</th>
            <th>Losses</th>
            <th>Points</th>
        </tr>
        {#each $leaderBoard as user, i}
            {#if user.name != $currUser.name}
                <tr>
                    <td>{i + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.gamesPlayed}</td>
                    <td>{user.wins}</td>
                    <td>{user.draws}</td>
                    <td>{user.losses}</td>
                    <td>{user.totalPoints}</td>
                </tr>
            {:else}
                <tr>
                    <th>{i + 1}</th>
                    <th>{user.name}</th>
                    <th>{user.gamesPlayed}</th>
                    <th>{user.wins}</th>
                    <th>{user.draws}</th>
                    <th>{user.losses}</th>
                    <th>{user.totalPoints}</th>
                </tr>
            {/if}
        {/each}
    </table>
</div>


<style>
    h5 {
        text-align:center;
        margin-top:20px;
    }

    table {
        width:100%;
    }

    td, th {
        height: 40px;
        border-bottom: 1px solid white;
        text-align: center;
    }

    #stats {
        width:33.33%;
        float:left;
        color:white;
    }

    #league {
        width:66.66%;
        float:right;
        color:white;
    }
</style>