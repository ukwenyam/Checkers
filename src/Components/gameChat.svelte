<script>
    import { currUser, gamePref } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';

    let div, autoscroll;
    let message;
    let msgs = [];

    function sendMsg() {

        if(message != null || message != '') {

        }
    }
</script>

{#if $gamePref.pri == $currUser.name}
    <h4 style="text-align:center">Other Player</h4>
{:else}
    <h4 style="text-align:center">{$gamePref.pri}</h4>
{/if}

<div class="scrollable" bind:this={div}>
    {#each msgs as msg}
        <article class={msg.author}>
            <span>{msg.text}</span>
        </article>
    {/each}
</div>

<input id="user-msg" placeholder="Type Here" bind:value="{message}" on:keydown="{event => event.which === 13 && sendMsg()}"/>

<style>
    .scrollable {
		flex: 1 1 auto;
		border-top: 1px solid #eee;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
    }
    
    #user-msg {
		bottom:10px;
        left:10px;
        width:96%;
        border-radius:0.4rem;
        box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        outline:none;
        border:none;
        position: absolute;
	}
</style>