<script>
	import Dash from './Pages/dashBoard.svelte';
	import Board from './Pages/gameBoard.svelte';
	import Entry from './Pages/entry.svelte';
	import ChatWindow from './Pages/Chatwindow.svelte';
	import { currUser, page } from './Scripts/Init.js';
	
</script>

{#if $currUser.isAuth}
	{#if $page == 0}
		<ChatWindow/>
		<!-- <Dash/> -->
	{:else if $page == 1}
		<Board/>
	{/if}
{:else}
		<Entry/>
{/if}