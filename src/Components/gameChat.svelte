<script>
    import { currSocket, currUser, gamePref } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { beforeUpdate, afterUpdate } from 'svelte';

    let div, autoscroll;
    let message;
    let msgs = [];
    let socket;
    let room = $gamePref.id;
    let currMsg = {};

    autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);

    function sendMsg() {

        if(message != null || message != '') {
            currMsg.name = $currUser.name;
            currMsg.msg = message;
            currMsg.room = room;
            $currSocket.emit('chat message', currMsg);

            //msgs.push(currMsg);

            if(autoscroll) div.scrollTo(0, div.scrollHeight);

            message = '';
        }
    }

    $currSocket.on('chat message', (data) => {
       console.log('Received: '+data.msg);
       msgs.push(data);
       console.log(msgs);
       msgs = msgs;
    });

</script>

{#if $gamePref.pri == $currUser.name}
    <h4 style="text-align:center">{$gamePref.sec}</h4>
{:else}
    <h4 style="text-align:center">{$gamePref.pri}</h4>
{/if}

<div class="scrollable" bind:this={div}>
    {#each msgs as mesage}
        {#if mesage.name == $currUser.name}
            <article class="myMsg">
                <span class="txtMsg">{mesage.msg}</span>
            </article>
        {:else}
            <article class="odaMsg">
                <span class="txtMsg">{mesage.msg}</span>
            </article>
        {/if}
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

    .myMsg {
        text-align: right;
    }

    .txtMsg {
        padding: 0.5em 1em;
        display: inline-block;
        color: white;
    }

    .myMsg .txtMsg {
        background: blue;
        border-radius: 1em 1em 0 1em;
    }

    .odaMsg .txtMsg {
        background: green;
        border-radius: 1em 1em 1em 0;
    }

    .myMsg {
        background: transparent;
        color: white;
    }

    .odaMsg {
        background: transparent;
        color: white;
    }

    article {
        margin: 0.5em 0;
    }
</style>