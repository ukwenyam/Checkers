<script>
	import { Position } from '../Scripts/Position.js';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { gameBoard, gameHistory, gamePref, currSocket, currUser, gameChat, gameTab } from '../Scripts/Init.js';
    import Chat from '../Components/gameChat.svelte';
	import Game from '../Components/gameBoard.svelte';
	import Nav from '../Components/navBar.svelte';
	
	let screenWidth = screen.width;
</script>

{#if screenWidth > 800}
	<Game/>
	<Chat/>
{/if}

{#if screenWidth <= 800}

	{#if $gameTab == 0}
		<Game/>
	{:else if $gameTab == 1}
		<Chat/>
	{/if}

	<Nav/>
{/if}

<style>
</style>