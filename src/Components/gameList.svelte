<script>
    import { userGames } from '../Scripts/Init.js';
</script>

{#if $userGames.length == 0}
    <h5 id="empty">There are no games to view</h5>
    <h5>Create or Join a Game</h5>
{:else}
    <h5>On-Going Games</h5>
    {#each $userGames as game}
        {#if !game.finished}
            <button class="btn btn-light">{game.priPlayer} vs. {game.secPlayer} - {game.date}</button>
        {/if}
    {/each}

    <h5>Finished Games</h5>
    {#each $userGames as game}
        {#if game.finished}
            <button class="btn btn-light">{game.priPlayer} vs. {game.secPlayer} - {game.date}</button>
        {/if}
    {/each}
{/if}

<style>
    h5 {
        text-align: center;
    }

    #empty {
        margin-top: 45%;
    }
</style>