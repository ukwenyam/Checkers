<script>
	import { Position } from '../Scripts/Position.js';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { invokeFunction } from '../Scripts/Cloud.js';
	import { fly, fade } from 'svelte/transition';
	import { gameBoard, gameHistory, gamePref, currSocket, currUser, 
			gameChat, gameTab, allChats, showLogin, showNavBar } from '../Scripts/Init.js';
    import Chat from '../Components/gameChat.svelte';
	import Game from '../Components/gameBoard.svelte';
	import Nav from '../Components/navBar.svelte';
	import Socket from '../Components/socketRecv.svelte';
	import SideBar from '../Components/sideBar.svelte';
	import Blur from '../Components/blurScreen.svelte';
	import Entry from './entry.svelte';
	import League from '../Components/leaderBoard.svelte';
	import Account from '../Components/settings.svelte';
	import List from '../Components/gameList.svelte';
	import Create from '../Components/gameCreate.svelte';
	import Join from '../Components/gameJoin.svelte';
	
	let screenWidth = screen.width;
	let screenHeight = screen.height;
	let showChat = false;

	function closeAll() {
		showChat = false;
		showLogin.set(false);
	}

	if($currUser != null && $currUser.isAuth)
		$currSocket.emit('go-online', $currUser.email);
</script>

<Socket/>

{#if screenWidth > screenHeight}
	{#if showChat || $showLogin}	
		<div on:click="{closeAll}">
			<Blur/>
		</div>
		{#if showChat}
			<Chat/>
		{:else}
			<Entry/>
		{/if}
	{/if}

	{#if $currUser != null && $currUser.isAuth}
		<button class="btn btn-dark btn-lg navi" style="right:5px;position:fixed;" on:click="{() => (showChat = true)}">Chat Board <i class="fa fa-comments"></i></button>
		<SideBar/>
	{:else}
		<button class="btn btn-dark btn-lg navi" style="right:5px;position:fixed;" on:click="{() => (showLogin.set(true))}">Login/Register <i class="fa fa-sign-in"></i></button>
	{/if}

	<Game/>
{:else}
	{#if $gameTab == 1}
		<div class="backcolor">
			<img alt="logo" src="./images/LOGO-192.png"/> 
			<h3 id="home">Checkas.io</h3>
			<button class="btn btn-secondary btn-lg" on:click="{() => (gameTab.set(4))}">vs Computer <i class="fa fa-desktop"></i></button>
			{#if $currUser != null && $currUser.isAuth}
				<button class="btn btn-secondary btn-lg" on:click="{() => (gameTab.set(2))}">Create Game <i class="fa fa-plus"></i></button>
				<button class="btn btn-secondary btn-lg" on:click="{() => (gameTab.set(3))}">Join Game <i class="fa fa-user-plus"></i></button>
			{:else}
				<hr/>
				<button class="btn btn-primary btn-lg" on:click="{() => (gameTab.set(8))}">Login/Register <i class="fa fa-sign-in"></i></button>
			{/if}
		</div>
	{:else if $gameTab == 2}
		<div class="backcolor"> 
			<Create/>
		</div>
	{:else if $gameTab == 3}
		<div class="backcolor">
			<Join/>
		</div>
	{:else if $gameTab == 4}
		<Game/>
	{:else if $gameTab > 4}
		{#if $currUser != null && $currUser.isAuth}
			<div class="backcolor">
				{#if $gameTab == 5}
					<List/>
				{:else if $gameTab == 6}
					<League/>
				{:else if $gameTab == 7}
					<Chat/>
				{:else if $gameTab == 8}
					<Account/>
				{/if}
			</div>
		{:else}
			<Entry/>
		{/if}
	{/if}

	{#if $showNavBar}
		<Nav/>
	{/if}
{/if}


<style>
	.navi {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		z-index:30;
	}

	img {
		height:100px;
		margin-left:calc((100% - 100px) / 2);
		margin-top:10px;
	}
	
	#home {
		margin-top:20px;
		text-align:center;
		color:white;
	}

	.backcolor {
		background-color:#343a40;
		position:fixed;
		top:0;
		left:0;
		width:101%;
		height:100%;
	}

	.btn-secondary {
		width:50%;
		margin-left:25%;
		margin-top:20%;
	}

	hr {
		margin-top:10%;
		background:white;
	}

	.btn-primary {
		width:50%;
		margin-left:25%;
		margin-top:10%;
	}
</style>