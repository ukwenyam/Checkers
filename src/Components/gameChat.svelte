<script>
    import { currSocket, currUser, gamePref, gameChat, allChats } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { beforeUpdate, afterUpdate } from 'svelte';
    import Indicator from './typeIndicator.svelte';

    let div, autoscroll;
    let message;
    let isTyping = false;
    let currMsg;

    let chatIndex = 0;
    let chatID = $allChats[0].id;
    let chatMsgs = $allChats[0].history;
    let chatUser = $allChats[0].priName == $currUser.name ? $allChats[0].secName : $allChats[0].priName;

    $currSocket.emit('join-room', chatID, $currUser.name);

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

    setInterval(function() {
        viewChat(chatIndex, true);
    }, 100);

    function viewChat(index, refresh) {
        chatIndex = index;

        chatID = $allChats[index].id;
        chatMsgs = $allChats[index].history;
        chatUser = $allChats[index].priName == $currUser.name ? $allChats[index].secName : $allChats[index].priName;
        
        if(!refresh)
            $currSocket.emit('join-room', chatID, $currUser.name);
    }

    function sendMsg() {

        if(message != null || message != '') {

            currMsg = {
                name: $currUser.name,
                msg: message,
                date: moment().format("YYYYMMDD, HH:mm"),
                room: chatID,
                chatID: chatID
            }

            $currSocket.emit('chat message', currMsg);

            message = '';
        }
    }

    function inputStatus() {
        if(message == '') {
            $currSocket.emit('no-typing', chatID);
        } else {
            $currSocket.emit('typing', chatID);
        }
    }

    function getTimeSpan(date) {
        return moment(date, "YYYYMMDD, HH:mm").fromNow();
    }
</script>

<div id="chatWindow">
    <div id="allChats">
        {#each $allChats as chat, i}
            <button class="user btn btn-lg btn-dark" on:click="{() => viewChat(i, false)}">
                <img alt="propic" src="https://source.unsplash.com/900x900/"/>
                <div style="float:right;height:100%;width:70%;">
                    <h5 style="text-align:left;">{chat.priName == $currUser.name ? chat.secName.toUpperCase() : chat.priName.toUpperCase()}</h5>
                    {#if chat.history.length > 0}
                        <p style="font-weight:lighter;font-size:15px;text-align:left;">{chat.history[chat.history.length - 1].msg}</p>
                        <p style="font-weight:lighter;font-size:15px;margin-top:-15px;text-align:right;">{getTimeSpan(chat.history[chat.history.length - 1].date)}</p>
                    {/if}
                </div>
            </button>
        {/each}
    </div>
    <div id="currChat">
        <h4 style="text-align:center;color:white;">
            <button class="btn btn-light" style="float:left;border-radius:0;">Versus Stats</button> 
                {chatUser.toUpperCase()} 
            <button class="btn btn-light" style="float:right;border-radius:0 0.4rem 0 0;" disabled="{$gamePref != null}">Request Game</button>
        </h4>
        <div class="scrollable container" bind:this={div}>
            {#each chatMsgs as mesage, i}
                {#if mesage.name == $currUser.name}
                    <article class="myMsg">
                        <span class="txtMsg">{mesage.msg}</span>
                        {#if i < chatMsgs.length - 1}
                            {#if chatMsgs[i + 1].date != chatMsgs[i].date}
                                <p style="font-size:10px;">{getTimeSpan(mesage.date)}</p>
                            {/if}
                        {:else}
                            <p style="font-size:10px;">{getTimeSpan(mesage.date)}</p>
                        {/if}
                    </article>
                {:else}
                    <article class="odaMsg">
                        <span class="txtMsg">{mesage.msg}</span>
                        {#if i < chatMsgs.length - 1}
                            {#if chatMsgs[i + 1].date != chatMsgs[i].date}
                                <p style="font-size:10px;">{getTimeSpan(mesage.date)}</p>
                            {/if}
                        {:else}
                            <p style="font-size:10px;">{getTimeSpan(mesage.date)}</p>
                        {/if}
                    </article>
                {/if}
            {/each}
            <article class='odaMsg' id="isTyping">
                {#if isTyping}
                    <span class='txtMsg' id="isTypingSpan"><Indicator/></span>
                {/if}
            </article>
        </div>
        <div id="inputBar">
            <i class="fa fa-camera fa-2x"></i>
            <input id="user-msg" placeholder="Type Here" bind:value="{message}" on:keyup="{inputStatus}" on:keydown="{event => event.which === 13 && sendMsg()}"/>
            <i class="fa fa-paper-plane-o fa-2x" on:click="{sendMsg}"></i>
        </div>
    </div>
</div>


<style>
    #chatWindow {
        z-index:99;
        background-color:#343a40;
        height: 800px;
        width:1000px;
        position:fixed;
        border-radius:0.4rem;
        top: calc((100% - 800px)/2);
        left: calc((100% - 1000px)/2);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    #allChats {
        width:33.33%;
        height:100%;
        float:left;
        color:white;
    }

    .user {
        width:100%;
        height:100px;
        padding: 10px;
    }

    img {
        height:100%;
        float:left;
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    p {
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis; 
    }

    #currChat {
        width:66.66%;
        height:100%;
        float:right;
        position:relative;
        display: flex;
        flex-direction: column;
        border-left:white 1px solid;
    }
    
    .scrollable {
		flex: 1 1 auto;
		margin: 0 0 0.5em 0;
        overflow-y: auto;
        max-height:87.5%;
    }

    #isTypingSpan {
        color: white;
        background:#eee;
        opacity: 65;
    }

    #inputBar {
        position:absolute;
        bottom:0;
        width:100%;
        background-color:#343a40;
        max-height:12.5%;
    }

    .fa {
        color:white;
        bottom:7.5px;
        position:absolute;
    }

    .fa-camera {
        left:20px;
    }

    .fa-paper-plane-o {
        right:20px;
    }
    
    #user-msg {
        margin-left:10%;
        width:80%;
        border-radius: 1em;
        outline:none;
        border:none;
        position:absolute;
        bottom:5px;
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

        #user-msg {
            bottom:0;
            left:0;
        }
    }
</style>