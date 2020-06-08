<script>
    import { gameTab } from '../Scripts/Init.js';

    let buttonId = "play";

    let btnArr = ["play", "eye", "list", "comet", "user"];

    setInterval(function() {
        let i;
        for(i = 0; i < btnArr.length; i++) {
            if(btnArr[i] == buttonId) {
                let button = document.getElementById(btnArr[i]);
                button.setAttribute("style", "background-color:#23272b");
            } else {
                let button = document.getElementById(btnArr[i]);
                button.setAttribute("style", "background-color:#343a40");
            }
        }
    });
    
    function switchTabs(tab, id) {
        buttonId = id;
		gameTab.set(tab);
	}
</script>

<div class="navbar">
    <button id="play" class="btn btn-dark" on:click="{() => switchTabs(1, "play")}">
        <i class="fa fa-play"></i>
        <span class="label">Play</span>
    </button>

    <button id="eye" class="btn btn-dark" on:click="{() => switchTabs(5, "eye")}">
        <i class="fa fa-eye"></i>
        <span class="label">Games</span>
    </button>

    <button id="list" class="btn btn-dark" on:click="{() => switchTabs(6, "list")}">
        <i class="fa fa-list-ol"></i>
        <span class="label">League</span>
    </button>

    <button id="comet" class="btn btn-dark" on:click="{() => switchTabs(7, "comet")}">
        <i class="fa fa-comments"></i>
        <span class="label">Chat</span>
    </button>

    <button id="user" class="btn btn-dark" on:click="{() => switchTabs(8, "user")}">
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

    .fa {
        width:100%;
    }

    .label {
        font-size:12.5px;
        width:100%;
    }
</style>