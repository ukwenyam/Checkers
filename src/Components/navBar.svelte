<script>
    import { gameTab } from '../Scripts/Init.js';

    
    function switchTabs(tab) {
		gameTab.set(tab);
	}
</script>

<div class="navbar">
    <button class="btn btn-dark" on:click="{() => switchTabs(1)}">
        <i class="fa fa-play"></i>
        <span class="label">Play</span>
    </button>

    <button class="btn btn-dark" on:click="{() => switchTabs(5)}">
        <i class="fa fa-eye"></i>
        <span class="label">Games</span>
    </button>

    <button class="btn btn-dark" on:click="{() => switchTabs(6)}">
        <i class="fa fa-list-ol"></i>
        <span class="label">League</span>
    </button>

    <button class="btn btn-dark" on:click="{() => switchTabs(7)}">
        <i class="fa fa-comments"></i>
        <span class="label">Chat</span>
    </button>

    <button class="btn btn-dark" on:click="{() => switchTabs(8)}">
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
    }

    button {
        width:20%;
        border-radius:0;
    }

    .fa {
        width:100%;
    }

    .label {
        font-size:12.5px;
        width:100%;
    }
</style>