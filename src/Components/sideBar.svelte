<script>
    import { currUser, page, userGames, leaderBoard, allChats, gamePref, viewCreateGame, viewJoinGame, smallPopUp } from '../Scripts/Init.js';
    import { fly, fade } from 'svelte/transition';
    import Create from './gameCreate.svelte';
    import Join from './gameJoin.svelte';
    import Blur from './blurScreen.svelte';
    import List from './gameList.svelte';
    import Settings from './settings.svelte';
    import LeagueTable from './leaderBoard.svelte';
    import { invokeFunction } from '../Scripts/Cloud.js';

    setTimeout(async () => {
        if($leaderBoard.length == 0) {
            await getUserGames();
            await getLeagueTable();
            await getAllChats();
        }
    }, 2000);

    let screenWidth = screen.width;

    let request;

    let viewRightSlide = false, viewLeftSlide = false;

    let gamesView = false, settingsView = false;

    let bigPopUp = false;

    let leaderBoardView = false, tutorialView = false;

    function getLeagueTable() {

        request = {
            func: "checkersLeague",
            name: $currUser.name
        }

        invokeFunction(request).then((response) => {
            //console.log(response);
            if(response.msg != null) {
                leaderBoard.set(response.msg.arr);

                currUser.update(state => {
                    state.position = response.msg.pos;
                    return state;
                });
            } else {
                console.log(response.err);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    function getUserGames() {

        request = {
            func: "retrieveUserGames",
            email: $currUser.email
        }

        invokeFunction(request).then((response) => {
            //console.log(response);
            if(response.msg != null) {

                let games = response.msg;
                
                userGames.update(state => {
                    state = [];
                    for(let i = 0; i < games.length; i++) {
                        if(games[i].finished)
                            state.push(games[i]);
                        else
                            state.unshift(games[i]);
                    }
                    return state;
                });
                
            } else {
                console.log(response.err);
                loading = false;
            }
        }).catch((error) => {
            console.log(error);
            loading = false;
        });
    }

    function getAllChats() {

        request = {
            func: "retrieveUserChats",
            email: $currUser.email
        }

        invokeFunction(request).then((response) => {
            console.log(response);
            if(response.msg != null) {
                allChats.set(response.msg);
            } else {
                console.log(response.err);
                loading = false;
            }
        }).catch((error) => {
            console.log(error);
            loading = false;
        });
    }

    function closeNav() {

        viewRightSlide = false, viewLeftSlide = false;

        gamesView = false, settingsView = false;

        smallPopUp.set(false), bigPopUp = false;

        viewCreateGame.set(false); viewJoinGame.set(false);

        leaderBoardView = false, tutorialView = false;
    }

    function popGamePref() {

        closeNav();

        setTimeout(() => { smallPopUp.set(true); }, 1);

        setTimeout(() => { viewCreateGame.set(true); }, 2);
    }

    function popGamePass() {

        closeNav();

        setTimeout(() => { smallPopUp.set(true); }, 1);

        setTimeout(() => { viewJoinGame.set(true); }, 2);
    }

    function viewGames() {

        if($leaderBoard.length > 0) {

            closeNav();

            setTimeout(() => { bigPopUp = true; }, 1);

            setTimeout(() => { gamesView = true; }, 1);
        }
    }

    function viewLeagueBoard() {

        if($leaderBoard.length > 0) {

            closeNav();

            setTimeout(() => { bigPopUp = true; }, 1);

            setTimeout(() => { leaderBoardView = true; }, 1);
        }
    }

    function viewSettings() {

        closeNav();

        setTimeout(() => { bigPopUp = true; }, 1);

        setTimeout(() => { settingsView = true; }, 1);
    }

    function signOut() {
        currUser.set(null);
    }
</script>

<div class="sidebar">
    <div class="menu-item">
        <button class="btn btn-lg btn-dark">Checkas.io <i class="fa fa-angle-double-right"></i></button>
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
        <button class="btn btn-lg btn-dark" on:click="{signOut}">Logout ({$currUser.name}) <i class="fa fa-sign-out"></i></button>
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
{:else if bigPopUp}
    <div on:click="{closeNav}">
        <Blur/>
    </div>
    <div id="bigPopUp" class="container-fluid" transition:fly={{ y:-200, duration:1000 }}>
        {#if screenWidth < 800}
            <button class="btn btn-danger" on:click="{closeNav}">Close</button>
        {/if}

        {#if gamesView}
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