<script>
    import { currSocket, currUser, gamePref, gameChat } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { beforeUpdate, afterUpdate } from 'svelte';

    let div, autoscroll;
    let message;

    if($gamePref.pri == $currUser.name && $gameChat.length == 0)
        $gameChat.push({name: "System", msg: "Please share Game Password '" + $gamePref.id + "' with other player"});
    
    let socket;
    let room = $gamePref.id;
    let currMsg = {};

    function blinker() {
        window.$('.blinking').fadeOut(500);
        window.$('.blinking').fadeIn(500);
    }

    setInterval(blinker, 1000);

    beforeUpdate(() => {
		autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

    function sendMsg() {

        if(message != null || message != '') {
            currMsg.name = $currUser.name;
            currMsg.msg = message;
            currMsg.room = room;
            $currSocket.emit('chat message', currMsg);

            //msgs.push(currMsg);

            message = '';
        }
    }

    $currSocket.on('chat message', (data) => {
       console.log('Received: '+data.msg);
       //$gameChat.push(data);
       gameChat.update(state => {
           state.push(data);
           return state;
       });
    });

</script>

{#if $gamePref.pri == $currUser.name && $gamePref.sec != null}
    <h4 style="text-align:center">{$gamePref.sec}</h4>
{:else if $gamePref.sec == null}
    <h4 class="blinking" style="text-align:center">Waiting for other player</h4>
{:else}
    <h4 style="text-align:center">{$gamePref.pri}</h4>
{/if}

<div class="scrollable" bind:this={div}>
    {#each $gameChat as mesage}
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
		bottom:20px;
        left:10px;
        width:100%;
        border-radius:0.4rem;
        box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        outline:none;
        border:none;
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

    ::-webkit-scrollbar {
        width:0px;
    }
</style>