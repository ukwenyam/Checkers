<script>
	import Dash from './Pages/dashBoard.svelte';
	import Board from './Pages/gameBoard.svelte';
	import Entry from './Pages/entry.svelte';
	import { currUser, page } from './Scripts/Init.js';
</script>

{#if $currUser != null && $currUser.isAuth}
	{#if $page == 0}
		<Dash/>
	{/if}

	{#if $page == 1}
		<Board/>
	{/if}
{:else}
	<Entry/>
{/if}