<script>
	import Dash from './Pages/dashBoard.svelte';
	import Play from './Pages/gamePlay.svelte';
	import Entry from './Pages/entry.svelte';
	import { currUser, page } from './Scripts/Init.js';
</script>

{#if $currUser != null && $currUser.isAuth}

	{#if $page == 0}
		<Dash/>
	{/if}

	{#if $page == 1}
		<Play/>
	{/if}
{:else}
	<Entry/>
{/if}