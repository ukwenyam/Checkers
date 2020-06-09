<script>
    import { gameTab, gamePref, userGames, leaderBoard, allChats, currUser } from '../Scripts/Init.js';
    import { fly, fade } from 'svelte/transition';

    let buttonId = null;

    let btnArr = ["play", "eye", "list", "comet", "user"];

    setTimeout(function() {
        switch($gameTab) {
            case 1:
                buttonId = btnArr[1];
                break;
            case 2:
                buttonId = btnArr[2];
                break;
            case 3:
                buttonId = btnArr[3];
                break;
            case 4:
                buttonId = btnArr[4];
                break;
            default:
                buttonId = btnArr[0];
        }
        
        let button = document.getElementById(buttonId);
        button.setAttribute("style", "background-color:#23272b");
    }, 1000);

    function switchTabs(tab, id) {
        gameTab.set(tab);
        buttonId = id;
        let i;
        for(i = 0; i < btnArr.length; i++) {
            if(btnArr[i] == id) {
                let button = document.getElementById(btnArr[i]);
                button.setAttribute("style", "background-color:#23272b");
            } else {
                let button = document.getElementById(btnArr[i]);
                button.setAttribute("style", "background-color:#343a40");
            }
        }
	}
</script>

<div class="navbar" transition:fly="{{ y:200, duration: 1000 }}">
    <button id="play" class="btn btn-dark" on:click="{() => switchTabs(0, "play")}" disabled="{$gamePref != null}">
        <i class="fa fa-play"></i>
        <span class="label">Play</span>
    </button>

    <button id="eye" class="btn btn-dark" on:click="{() => switchTabs(1, "eye")}" disabled="{$userGames == null}">
        <i class="fa fa-eye"></i>
        <span class="label">Games</span>
    </button>

    <button id="list" class="btn btn-dark" on:click="{() => switchTabs(2, "list")}" disabled="{$leaderBoard == null}">
        <i class="fa fa-list-ol"></i>
        <span class="label">League</span>
    </button>

    <button id="comet" class="btn btn-dark" on:click="{() => switchTabs(3, "comet")}" disabled="{$allChats == null}">
        <i class="fa fa-comments"></i>
        <span class="label">Chat</span>
    </button>

    <button id="user" class="btn btn-dark" on:click="{() => switchTabs(4, "user")}" disabled="{$currUser == null}">
        <i class="fa fa-user"></i>
        <span class="label">Account</span>
    </button>
</div>

<style>
    .navbar {
        background-color: #343a40;
        overflow: hidden;
        position: fixed;
        z-index:100;
        bottom: 0;
        left: 0;
        padding:0;
        width: 100%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    button {
        width:20%;
        border-radius:0;
        border-color:transparent;
    }

    .btn-dark:focus {
        box-shadow:unset;
    }

    .fa {
        width:100%;
    }

    .label {
        font-size:12.5px;
        width:100%;
    }
</style>