<script>
	import { Position } from '../Scripts/Position.js';
	import { Board } from '../Scripts/Board.js';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { invokeFunction } from '../Scripts/Cloud.js';
	import { fly, fade } from 'svelte/transition';
	import { gameBoard, gameHistory, gamePref, currSocket, currUser, 
			 gameTab, allChats, showLogin, showNavBar } from '../Scripts/Init.js';
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

	setInterval(function() {
		if($currUser != null && $currUser.isAuth)
			$currSocket.emit('go-online', $currUser.email);
	}, 10000);

	function viewCreateGame() {
		let index = document.getElementById("index");
		index.setAttribute("style", "left:-100%");

		let create = document.getElementById("create");
		create.setAttribute("style", "left:0;");
	}

	function viewJoinGame() {
		let index = document.getElementById("index");
		index.setAttribute("style", "left:100%");

		let join = document.getElementById("join");
		join.setAttribute("style", "left:0;");
	}

	function closeAll() {
		showChat = false;
		showLogin.set(false);
	}
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
	{#if $gameTab == 0}
		<div id="index" class="backcolor" out:fade>
			<img alt="logo" src="./images/LOGO-192.png"/> 
			<h3 id="home">Checkas.io</h3>
			<button class="btn btn-secondary btn-lg" on:click="{() => (gameTab.set(5))}">vs Computer <i class="fa fa-desktop"></i></button>
			<hr/>
			{#if $currUser != null && $currUser.isAuth}
				<button class="btn btn-secondary btn-lg" on:click="{viewCreateGame}">Create Game <i class="fa fa-plus"></i></button>
				<button class="btn btn-secondary btn-lg" on:click="{viewJoinGame}">Join Game <i class="fa fa-user-plus"></i></button>
			{:else}
				<button class="btn btn-primary btn-lg" on:click="{() => (gameTab.set(4))}">Login/Register <i class="fa fa-sign-in"></i></button>
			{/if}
		</div>
		<div id="create" class="backcolor">
			<Create/>
		</div>
		<div id="join" class="backcolor">
			<Join/>
		</div>
	{:else if $gameTab == 5}
		<Game/>
	{:else if $gameTab > 0 && $gameTab < 5}
		{#if $currUser != null && $currUser.isAuth}
			<div class="backcolor">
				{#if $gameTab ==1}
					<List/>
				{:else if $gameTab == 2}
					<League/>
				{:else if $gameTab == 3}
					<Chat/>
				{:else if $gameTab == 4}
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
		height:80px;
		width:80px;
		margin-left:calc((100% - 80px) / 2);
		margin-top:10px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}
	
	#home {
		margin-top:30px;
		text-align:center;
		text-transform: uppercase;
	}

	.backcolor {
		color:white;
		background-color:#343a40;
		top:0;
		left:0;
		width:101%;
		height:100%;
		position:fixed;
        display: flex;
		flex-direction: column;
		transition: ease-in-out 1s; 
	}

	#index {
		top:0;
		left:0;
	}

	#create {
		top:0;
		left:100%;
	}

	#join {
		top:0;
		left:-100%;
	}

	.btn-secondary {
		width:50%;
		margin-left:25%;
		margin-top:10%;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}

	hr {
		margin-top:10%;
		background:black;
		width:80%;
		margin-left:10%;
	}

	.btn-primary {
		width:50%;
		margin-left:25%;
		margin-top:10%;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}
</style>