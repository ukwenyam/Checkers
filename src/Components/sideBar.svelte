<script>
    import { currUser, page, userGames, leaderBoard, allChats, gamePref, currSocket,
             viewCreateGame, viewJoinGame, viewGameList, smallPopUp, bigPopUp, gameTab } from '../Scripts/Init.js';
    import { fly, fade } from 'svelte/transition';
    import Create from './gameCreate.svelte';
    import Join from './gameJoin.svelte';
    import Blur from './blurScreen.svelte';
    import List from './gameList.svelte';
    import Settings from './settings.svelte';
    import LeagueTable from './leaderBoard.svelte';
    import { invokeFunction } from '../Scripts/Cloud.js';
    
    let screenWidth = screen.width;

    let request;

    let viewRightSlide = false, viewLeftSlide = false;

    let settingsView = false;

    let leaderBoardView = false, tutorialView = false;

    function closeNav() {

        viewRightSlide = false, viewLeftSlide = false;

        viewGameList.set(false), settingsView = false;

        smallPopUp.set(false), bigPopUp.set(false);

        viewCreateGame.set(false); viewJoinGame.set(false);

        leaderBoardView = false, tutorialView = false;
    }

    function popGamePref() {

        closeNav();

        setTimeout(() => { smallPopUp.set(true); }, 1);

        setTimeout(() => { viewCreateGame.set(true); }, 2);

        gameTab.set(0);
    }

    function popGamePass() {

        closeNav();

        setTimeout(() => { smallPopUp.set(true); }, 1);

        setTimeout(() => { viewJoinGame.set(true); }, 2);

        gameTab.set(0);
    }

    function viewGames() {

        closeNav();

        setTimeout(() => { bigPopUp.set(true); }, 1);

        setTimeout(() => { viewGameList.set(true); }, 1);

        gameTab.set(1);
    }

    function viewLeagueBoard() {

        closeNav();

        setTimeout(() => { bigPopUp.set(true); }, 1);

        setTimeout(() => { leaderBoardView = true; }, 1);

        gameTab.set(2);
    }

    function viewSettings() {

        closeNav();

        setTimeout(() => { bigPopUp.set(true); }, 1);

        setTimeout(() => { settingsView = true; }, 1);

        gameTab.set(4);
    }

    function signOut() {
        $currSocket.emit('go-offline', $currUser.profile.email);
        currUser.set(null);
    }
</script>

<div class="sidebar">
    <div class="menu-item">
        <button id="home" class="btn btn-lg btn-dark"><img alt="logo" src="./images/LOGO-192.png"/> Checkas.io <i class="fa fa-angle-double-right"></i></button>
    </div>
   
    <div class="menu-item create">
        <button class="btn btn-lg btn-dark" on:click="{popGamePref}" disabled="{$gamePref != null}">Create Game <i class="fa fa-plus-square"></i></button>
    </div>

    <div class="menu-item join">
        <button class="btn btn-lg btn-dark" on:click="{popGamePass}" disabled="{$gamePref != null}">Join Game <i class="fa fa-user-plus"></i></button>
    </div>

    <div class="menu-item view">
        <button class="btn btn-lg btn-dark" on:click="{viewGames}">View Games <i class="fa fa-eye"></i></button>
    </div>

    <div class="menu-item league">
        <button class="btn btn-lg btn-dark" on:click="{viewLeagueBoard}">Leadership Board <i class="fa fa-list-ol"></i></button>
    </div>

    <div class="menu-item settings">
        <button class="btn btn-lg btn-dark" on:click="{viewSettings}">Settings <i class="fa fa-cog"></i></button>
    </div>

    <div class="menu-item logout">
        <button class="btn btn-lg btn-dark" on:click="{signOut}">Logout ({$currUser.profile.name}) <i class="fa fa-sign-out"></i></button>
    </div>
</div>

{#if $smallPopUp}
    <div on:click="{closeNav}">
        <Blur/>
    </div>
    <div id="smallPopUp" class="container-fluid" transition:fly={{ y:-200, duration:1000 }}>
        {#if screenWidth < 800}
            <button class="btn btn-danger" on:click="{closeNav}">Close</button>
        {/if}

        {#if $viewCreateGame}
            <Create/>
        {/if}

        {#if $viewJoinGame}
            <Join/>
        {/if}
    </div>
{:else if $bigPopUp}
    <div on:click="{closeNav}">
        <Blur/>
    </div>
    <div id="bigPopUp" class="container-fluid" transition:fly={{ y:-200, duration:1000 }}>
        {#if screenWidth < 800}
            <button class="btn btn-danger" on:click="{closeNav}">Close</button>
        {/if}

        {#if $viewGameList}
            <List/>
        {/if}

        {#if settingsView}
            <Settings/>
        {/if}

        {#if leaderBoardView}
            <LeagueTable/>
        {/if}
    </div>
{/if}

<style>
    #home img {
        float:left;
        height:30px;
    }

    button {
        width:100%;
    }

    .menu-item {
        width:100%;
        height:50px;
    }

    .create {
        margin-top:50px;
    }

    .join {
        margin-top:20px;
    }

    .view {
        margin-top:20px;
    }

    .league {
        margin-top:20px;
    }

    .settings {
        margin-top:20px;
    }

    .logout {
        margin-top:120%;
    }

    .sidebar {
        z-index:30;
        height:100%;
        width:300px;
        background-color: #343a40;
        top:0;
        left:-250px;
        position:fixed;
        transition: ease-in-out 1s;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .sidebar:hover {
        left:0;
    }

    .fa {
        float:right;
        margin-top:5px;
    }

    #smallPopUp {
        width:400px;
        height:400px;
        background-color: #343a40;
        z-index:99; 
        border-radius:0.4rem;
        top:calc((100% - 400px)/2);
        left:calc((100% - 400px)/2);
        position:fixed;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    #bigPopUp {
        width:1000px;
        height:800px;
        background-color: #343a40;
        z-index:99; 
        border-radius:0.4rem;
        top:calc((100% - 800px)/2);
        left:calc((100% - 1000px)/2);
        position:fixed;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>