<script>
    import { currUser, page, userGames } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { fly } from 'svelte/transition';
    import List from '../Components/gameList.svelte';
    import Settings from '../Components/settings.svelte';
    import Prefs from '../Components/gamePref.svelte';
    import Pass from '../Components/gamePass.svelte';

    let request;

    let viewRightSlide = false, viewLeftSlide = false;

    let gamesView = false, settingsView = false;

    let popUp = false;

    let gamePrefView = false, gamePassView = false;

    let screenWidth = screen.width;

    function closeNav() {

        viewRightSlide = false, viewLeftSlide = false;

        gamesView = false, settingsView = false;

        popUp = false;

        gamePrefView = false, gamePassView = false;
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

        closeNav();

        setTimeout(() => { viewRightSlide = true; }, 1);

        if($userGames == null) {

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

                    setTimeout(() => { gamesView = true; }, 1);
                } else {
                    console.log(response.err);
                }
            }).catch((error) => {
                console.log(error);
            });
        } else {
            setTimeout(() => { gamesView = true; }, 1);
        }
    }

    function viewSettings() {

        closeNav();

        setTimeout(() => { viewRightSlide = true; }, 1);

        setTimeout(() => { settingsView = true; }, 1);
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

<div id="backpurple" on:click="{closeNav}">

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

    <button class="circles btn btn-info">
        Leadership Board 
    </button>>

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

        {#if gamesView}
            <List/>
        {/if}

        {#if settingsView}
            <Settings/>
        {/if}
    </div>
{/if}

<style>
    #popUp {
        width:400px;
        height:400px;
        background-color: pink;
        opacity:0.97;
        z-index:99; 
        border-radius:0.4rem;
        top:200px;
        left:35%;
        position:fixed;
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
        opacity:0.97;
    }

    h1 {
        text-align: center;
        top:50px;
        left:42.5%;
        position:fixed;
    }

    #backpurple {
        background-color: purple;
        width: 100%;
        height: 100%; 
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

        #rightSlide {
            width:100%;
        }

        h1 {
            text-align: center;
            top:25px;
            left:25%;
            position:fixed;
        }

		.circles {
            width:30%;
            height:15%;
            font-size: 95%;
            border-radius: 0.4rem;
            margin-top:30%;
        }

        #rightSlide {
            opacity:1;
        }
    }
</style>