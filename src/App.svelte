<script>
	import Play from './Pages/gamePlay.svelte';
	import Entry from './Pages/entry.svelte';
	import { currUser, page } from './Scripts/Init.js';
</script>

{#if $currUser != null && $currUser.isAuth}
	<Play/>
{:else}
	<Entry/>
{/if}