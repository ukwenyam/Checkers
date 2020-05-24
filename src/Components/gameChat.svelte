<script>
    import { currSocket, currUser, gamePref } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { beforeUpdate, afterUpdate } from 'svelte';

    let div, autoscroll;
    let message;
    let msgs = [];
    msgs.push({name: "System", msg: "Please share the Game Password '" + $gamePref.id + "' with other player" });
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
    
    window.$(document).ready( function (){
        document.getElementById('user-msg').addEventListener('input', function() {
            inputStatus();
        });
        

        $currSocket.on('typing', (room) => {
            let typing = document.getElementById('isTypingSpan');
            typing.style.visibility = 'visible';
            // typing.style.setProperty('color', 'white');
        });

        $currSocket.on('no-typing', (room) => {
            let typing = document.getElementById('isTypingSpan');
            typing.style.visibility = 'hidden';
        });
    });

      function inputStatus() {
             console.log("change happened");
             if(window.$('#user-msg').val() == ''){
                 console.log('stopped typing...');
                 $currSocket.emit('no-typing', room);
             }
             else{
                 console.log('typing...');
                 $currSocket.emit('typing', room);
             }
         }

    function sendMsg() {    
        console.log("Log for send message");
        if(message != null && message != '') {
            currMsg.name = $currUser.name;
            currMsg.msg = message;
            currMsg.room = room;
            $currSocket.emit('chat message', currMsg);
            message = '';
        }
       $currSocket.emit('no-typing', room);
    }

    $currSocket.on('chat message', (data) => {
       console.log('Received: '+data.msg);
       msgs.push(data);
       console.log(msgs);
       msgs = msgs;
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
    <article class='odaMsg' id="isTyping">
        <span class='txtMsg' id="isTypingSpan" style="visibility: hidden">typing...</span>
    </article>
</div>
 
<input id="user-msg" placeholder="Type Here"  bind:value="{message}" on:keydown="{event => event.which === 13 && sendMsg()}"/>

<style>
    .scrollable {
		flex: 1 1 auto;
		border-top: 1px solid #eee;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
    }

    #isTypingSpan {
        color: white;
        background:  rgb(120, 236, 10);;
        opacity: 65;
    }

    #user-msg {
		bottom:10px;
        left:10px;
        width:96%;
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
        width: 0px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888; 
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
</style>