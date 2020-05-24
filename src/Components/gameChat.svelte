<script>
    import { currSocket, currUser, gamePref, gameChat } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { beforeUpdate, afterUpdate } from 'svelte';
    import Indicator from './typeIndicator.svelte';

    let div, autoscroll;
    let message;
    let isTyping = false;

    if($gamePref.pri == $currUser.name && $gameChat.length == 0 && $gamePref.sec == null)
        $gameChat.push({name: "System", msg: "Please share Game Password '" + $gamePref.id + "' with other player"});
    
    let socket;
    let room = $gamePref.id;
    let currMsg = {};

    beforeUpdate(() => {
		autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
    });
    
    $currSocket.on('typing', (room) => {
        isTyping = true;
    });

    $currSocket.on('no-typing', (room) => {
        isTyping = false;
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

    function inputStatus() {

        if(message == '') {
            $currSocket.emit('no-typing', room);
        } else {
            $currSocket.emit('typing', room);
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

<div id="chat" class="container-fluid">
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
        <article class='odaMsg' id="isTyping">
            {#if isTyping}
                <span class='txtMsg' id="isTypingSpan"><Indicator/></span>
            {/if}
        </article>
    </div>

    <input id="user-msg" placeholder="Type Here" bind:value="{message}" on:keyup="{inputStatus}" on:keydown="{event => event.which === 13 && sendMsg()}"/>
</div>


<style>
    #chat {
		height:var(--board-height);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		bottom:5px;
		right:5px;
		position:fixed;
		width:var(--chat-width);
        border-radius:0.4rem;
        display: flex;
        flex-direction: column;
        background: white;
        opacity: 0.9;
        max-width:var(--board-height);
    }
    
    .scrollable {
		flex: 1 1 auto;
		border-top: 1px solid #eee;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
    }

    #isTypingSpan {
        color: white;
        background:#eee;
        opacity: 65;
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

    @media screen and (max-width: 800px) {

        #chat {
            width:100%;
            height:92.5%;
            box-shadow:unset;
            bottom:unset;
            top:0;
            left:0;
            right:0;
        }

        #user-msg {
            bottom:0;
            left:0;
        }
    }
</style>