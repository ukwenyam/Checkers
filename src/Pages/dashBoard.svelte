<script>
    import { currUser, page, userGames, leaderBoard } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { fly, fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import List from '../Components/gameList.svelte';
    import Settings from '../Components/settings.svelte';
    import Prefs from '../Components/gamePref.svelte';
    import Pass from '../Components/gamePass.svelte';
    import LeagueTable from '../Components/leaderBoard.svelte';

    setTimeout(async () => {
        if($leaderBoard.length == 0) {
            await getUserGames();
            await getLeagueTable();
        }
    }, 2000);

    let screenWidth = screen.width;

    let request;

    let viewRightSlide = false, viewLeftSlide = false;

    let gamesView = false, settingsView = false;

    let popUp = false;

    let gamePrefView = false, gamePassView = false;

    let leaderBoardView = false, tutorialView = false;

    let loading = true;

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

    function closeNav() {

        viewRightSlide = false, viewLeftSlide = false;

        gamesView = false, settingsView = false;

        popUp = false;

        gamePrefView = false, gamePassView = false;

        leaderBoardView = false, tutorialView = false;
    }

    function popGamePref() {
        closeNav();

        setTimeout(() => { popUp = true; }, 1);

        setTimeout(() => { gamePrefView = true; }, 2);
    }

    function popGamePass() {
        closeNav();

        setTimeout(() => { popUp = true; }, 1);

        setTimeout(() => { gamePassView = true; }, 2);
    }

    function viewGames() {

        if($leaderBoard.length > 0) {

            closeNav();

            loading = false;

            setTimeout(() => { viewRightSlide = true; }, 1);

            setTimeout(() => { gamesView = true; }, 1);
        }
    }

    function viewLeagueBoard() {

        if($leaderBoard.length > 0) {

            closeNav();

            loading = false;

            setTimeout(() => { viewRightSlide = true; }, 1);

            setTimeout(() => { leaderBoardView = true; }, 1);
        }
    }

    function viewSettings() {

        closeNav();

        loading = false;

        setTimeout(() => { viewRightSlide = true; }, 1);

        setTimeout(() => { settingsView = true; }, 1);
    }

    function signOut() {
        currUser.set(null);
    }
</script>

{#if popUp}
    <div id="popUp" class="container-fluid" transition:fly={{ y:-200, duration:1000 }}>
        {#if screenWidth < 800}
            <button class="btn btn-danger" on:click="{closeNav}">Close</button>
        {/if}

        {#if gamePrefView}
            <Prefs/>
        {/if}

        {#if gamePassView}
            <Pass/>
        {/if}
    </div>
{/if}

{#if popUp || viewRightSlide}
    <div class="container-fluid" on:click="{closeNav}" transition:fade></div>
{/if}

<div id="backpurple">

    <button id="logout" class="btn btn-danger" on:click="{signOut}">Logout ({$currUser.name})</button>

    <h1>Dashboard</h1>

    <button class="circles btn btn-info" on:click="{popGamePref}">
        Create Game
    </button>

    <button class="circles btn btn-info" on:click="{popGamePass}">
        Join Game
    </button>

    <button class="circles btn btn-info" on:click="{viewGames}">
        View Games
    </button>

    <button class="circles btn btn-info" on:click="{viewLeagueBoard}">
        Leadership Board 
    </button>

    <button class="circles btn btn-info">
        Tutorial 
    </button>

    <button class="circles btn btn-info" on:click="{viewSettings}">
        Settings
    </button>
</div>

{#if viewRightSlide}
    <div id="rightSlide" class="container-fluid" transition:fly={{ x:200, duration:1000 }}>
        {#if screenWidth < 800}
            <button class="btn btn-danger" on:click="{closeNav}">Back</button>
        {/if}

        {#if loading}
            <div id="signin-loader" class="loader-container">
                <div class="loader"></div>
            </div>
        {:else}
            {#if gamesView}
                <List/>
            {/if}

            {#if settingsView}
                <Settings/>
            {/if}

            {#if leaderBoardView}
                <LeagueTable/>
            {/if}
        {/if}
    </div>
{/if}

<style>
    .loader-container {
        width: 100%;
        align-items: center;
        justify-content: center;
        display: flex;
        margin-top:50%;
    }

    .loader {
        width: 50px;
        height: 50px;
        border: 5px solid;
        color: #3498db;
        border-radius: 50%;
        border-top-color: transparent;
        animation: loader 1.2s linear infinite;
    }

    @keyframes loader {
        25%{
            color: #2ecc71;
        }
        50%{
            color: #f1c40f;
        }
        75%{
            color: #e74c3c;
        }
        to{
            transform: rotate(360deg);
        }
    }

    #popUp {
        width:400px;
        height:400px;
        background-color: pink;
        z-index:99; 
        border-radius:0.4rem;
        top:200px;
        left:35%;
        position:fixed;
    }

    #logout {
        position:fixed;
        right:20px;
        top:10px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .btn-danger {
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-top:10px;
    }

    #rightSlide {
        z-index:99;
        height:100%;
        width:400px;
        background-color: pink;
        top:0;
        right:0;
        position:fixed;
    }

    h1 {
        text-align: center;
        top:50px;
        z-index:10;
        position: relative;
    }

    #backpurple {
        background-color: purple;
        width: 100%;
        height: 100%; 
    }

    .container-fluid {
        width: 100%;
        height: 100%;
        z-index:50;
        position:fixed;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);   
        border-radius: 5px;
        background-color: rgba(255, 255, 255, .15);
        backdrop-filter: blur(5px);
    } 

    .circles {
        border-radius: 50%;
        width:200px;
        height:200px;
        float:left;
        margin-left:14%;
        margin-top:10%;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        font-size: 25px;
        color:black;
        text-align: center;
    }

    @media screen and (max-width: 800px) {

        #popUp {
            width:100%;
            left:0;
            opacity:1;
        }

        #logout {
            position:fixed;
            right:unset;
            top:unset;
            bottom:20px;
            width:50%;
            margin-left:25%;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }

        #rightSlide {
            width:100%;
            opacity:1;
            overflow-y: scroll;
        }

        h1 {
            margin-top:25px;
            top:unset;
            position:unset;
        }

		.circles {
            width:30%;
            height:15%;
            font-size: 95%;
            border-radius: 0.4rem;
            margin-top:15%;
        }

        #backpurple {
            height: 110%;
            overflow-y: scroll;
        }
    }
</style>