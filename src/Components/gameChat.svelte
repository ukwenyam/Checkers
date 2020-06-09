<script>
    import { currSocket, currUser, gamePref, allChats, showNavBar } from '../Scripts/Init.js';
    import { getAllChats } from '../Scripts/Functions.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { beforeUpdate, afterUpdate } from 'svelte';
    import Indicator from './typeIndicator.svelte';

    let div, autoscroll;
    let message;
    let isTyping = false;
    let currMsg;

    let screenWidth = screen.width;

    let chatID, chatMsgs, chatUser, userID, online = false;

    let currChat = $allChats.length > 0 ? $allChats[0] : null;

    if(currChat != null) {
        chatID = currChat.id;
        chatMsgs = currChat.history;
        chatUser = currChat.priName == $currUser.name ? currChat.secName : currChat.priName;
        userID = currChat.priName == $currUser.name ? currChat.secEmail : currChat.priEmail;
        
        $currSocket.emit('join-room', chatID, $currUser.name);
    }

    setInterval(function() {
        if($allChats.length > 0) {
            $currSocket.emit('check-status', $allChats);
        }
    }, 5000);

    $currSocket.on('get-status', (chats) => {
        if(Array.isArray(chats)) {
            allChats.set(chats);
            viewChat(currChat, true);
        }
    });

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

    function viewChat(chat, refresh) {

        if(chat != null) {

            if(screen.width <= 800 && !refresh) {
                showNavBar.set(false);
                let allChats = document.getElementById("allChats");
                allChats.setAttribute("style", "left:-100%");

                let currChat = document.getElementById("currChat");
                currChat.setAttribute("style", "left:0;");
            }

            currChat = chat;

            chatID = chat.id;
            chatMsgs = chat.history;
            chatUser = chat.priName == $currUser.name ? chat.secName : chat.priName;
            userID = chat.priName == chat.name ? chat.secEmail : chat.priEmail;

            $currSocket.emit('check-status', userID, chatID);

            if(!refresh)
                $currSocket.emit('join-room', chatID, $currUser.name);
        }
    }

    function viewStatsOrChats() {

        if(screen.width <= 800) {
            showNavBar.set(true);
            let allChats = document.getElementById("allChats");
            allChats.setAttribute("style", "left:0%");

            let currChat = document.getElementById("currChat");
            currChat.setAttribute("style", "left:100%;");
        }
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
    {#if $allChats.length > 0}
        <div id="allChats">
            {#each $allChats as chat}
                <button class="user btn btn-lg btn-dark" on:click="{() => viewChat(chat, false)}">
                    <img alt="propic" src="{chat.priName == $currUser.name ? 'https://api.adorable.io/avatars/285/' + chat.secEmail + '.png' : 'https://api.adorable.io/avatars/285/' + chat.priEmail + '.png'}"/>
                    <div class="chatPrev">
                        <h5 style="text-align:left;margin-bottom:0px;">{chat.priName == $currUser.name ? chat.secName.toUpperCase() : chat.priName.toUpperCase()}
                            {#if chat.online}
                                <span class="indicator online"></span>
                            {/if}
                        </h5>
                        {#if chat.history.length > 0}
                            <p style="font-weight:lighter;font-size:15px;text-align:left;">{chat.history[chat.history.length - 1].msg}</p>
                            <p style="font-weight:lighter;font-size:15px;text-align:right;">{getTimeSpan(chat.history[chat.history.length - 1].date)}</p>
                        {/if}
                    </div>
                </button>
            {/each}
        </div>
        <div id="currChat">
            <h4 style="text-align:center;color:white;">
                <button class="btn btn-dark chatHead" style="float:left;border-radius:0;" on:click="{viewStatsOrChats}">
                    {#if screenWidth <= 800}
                        Back To Chats
                    {:else}
                        Versus Stats
                    {/if}
                </button> 
                    {chatUser.toUpperCase()}
                <button class="btn btn-dark chatHead" style="float:right;border-radius:0 0.4rem 0 0;" disabled="{$gamePref != null}">Request Game</button>
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
                <input id="user-msg" placeholder="Type Here" bind:value="{message}" on:keyup="{inputStatus}" on:keydown="{event => event.which === 13 && sendMsg()}"/>
                {#if screenWidth > 800}
                    <i class="fa fa-camera fa-2x"></i>
                    <i class="fa fa-paper-plane-o fa-2x" on:click="{sendMsg}"></i>
                {/if}
            </div>
        </div>
    {:else}
        <h5 class="empty" style="margin-top:25%;text-align:center;">There are no Chats to View</h5>
        <h5 class="empty" style="text-align:center;">Create or Join a Game to Chat</h5>
    {/if}
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

    .empty {
        color:white;
    }

    #allChats {
        width:33.33%;
        height:100%;
        float:left;
        color:black;
        overflow-y:auto;
    }

    .user {
        width:100%;
        height:100px;
        padding: 10px;
        border-radius:0px;
        border-bottom:1px solid white;
    }

    .chatPrev {
        float:right;
        height:100%;
        width:70%;
    }

    .indicator.online {
        background: #28B62C;
        display: inline-block;
        width: 0.5em;
        height: 0.5em;
        border-radius: 50%;
        -webkit-animation: pulse-animation 2s infinite linear;
    }

    @-webkit-keyframes pulse-animation {
        0% { -webkit-transform: scale(1); }
        25% { -webkit-transform: scale(1); }
        50% { -webkit-transform: scale(1.2) }
        75% { -webkit-transform: scale(1); }
        100% { -webkit-transform: scale(1); }
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
        margin-bottom:0px;
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
        background: slateblue;
        border-radius: 1em 1em 0 1em;
    }

    .odaMsg .txtMsg {
        background: skyblue;
        border-radius: 1em 1em 1em 0;
        color:black;
    }

    .myMsg {
        background: transparent;
        color: white;
    }

    .chatHead {
        width:33.33%;
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

        #chatWindow {
            height: 100%;
            width: 100%;
            position:fixed;
            border-radius:0;
            top: 0;
            left: 0;
        }

        #allChats {
            width:100%;
            float:unset;
            transition: ease-in-out 1s; 
            position:fixed;
            left:0;
            top:0;
        }

        #currChat {
            width:100%;
            float:unset;
            border-left:none;
            transition: ease-in-out 1s;
            position:fixed;
            left:100%;
            top:0;
        }

        .scrollable {
            border-top: 1px solid white;
        }

        #user-msg {
            margin-left:5%;
            width:90%;
        }

        .chatPrev {
            width:75%;
        }
    }
</style>