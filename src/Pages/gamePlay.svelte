<script>
	import { Position } from '../Scripts/Position.js';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { invokeFunction } from '../Scripts/Cloud.js';
	import { fly, fade } from 'svelte/transition';
    import { gameBoard, gameHistory, gamePref, currSocket, currUser, gameChat, gameTab } from '../Scripts/Init.js';
    import Chat from '../Components/gameChat.svelte';
	import Game from '../Components/gameBoard.svelte';
	import Nav from '../Components/navBar.svelte';
	import Socket from '../Components/socketRecv.svelte';
	import SideBar from '../Components/sideBar.svelte';
	import Blur from '../Components/blurScreen.svelte';
	
	let screenWidth = screen.width;

	let showChat = false;
</script>

<Socket/>

{#if screenWidth > 800}
	{#if showChat}	
		<div on:click="{() => (showChat = false)}">
			<Blur/>
		</div>
		<Chat/>
	{/if}

	<button class="btn btn-dark btn-lg navi" style="right:5px;position:fixed;" on:click="{() => (showChat = true)}">Chat Board <i class="fa fa-comments"></i></button>
	<SideBar/>
	<Game/>
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
	.navi {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		z-index:30;
	}
</style>