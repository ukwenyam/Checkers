<script>
    import { currSocket, currUser, gamePref, allChats, calleeID, calleeName, callerName,
            showNavBar, showPlayer, peer, showCallee, showCallBar, onCall, callerID, ratio } from '../Scripts/Init.js';
    import { getAllChats, blink_text } from '../Scripts/Functions.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { beforeUpdate, afterUpdate } from 'svelte';
    import Indicator from './typeIndicator.svelte';
    import Loader from './loader.svelte';
    import Player from './audioPlayer.svelte';

    $currSocket.emit('go-online', $currUser.profile.email);

    let div, autoscroll;
    let message;
    let isTyping = false;
    let currMsg;

    let chatID, chatMsgs, chatUser, userID;

    let currChat = $allChats.length > 0 ? $allChats[0] : null;

    if(currChat != null) {
        chatID = currChat.id;
        chatMsgs = currChat.history;
        chatUser = currChat.priName == $currUser.profile.name ? currChat.secName : currChat.priName;
        userID = currChat.priEmail == $currUser.profile.email ? currChat.secEmail : currChat.priEmail;
    }

    beforeUpdate(() => {
		autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
    });
    
    $currSocket.on('typing', (id) => {
        if(id == $currUser.profile.email)
            isTyping = true;
    });

    $currSocket.on('no-typing', (id) => {
        if(id == $currUser.profile.email)
            isTyping = false;
    }); 

    setInterval(function() {
        if($allChats != null && $allChats.length > 0)
            viewChat(currChat, true);
    }, 500);
    
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

            chatID = currChat.id;
            chatMsgs = currChat.history;
            chatUser = currChat.priName == $currUser.profile.name ? currChat.secName : currChat.priName;
            userID = currChat.priEmail == $currUser.profile.email ? currChat.secEmail : currChat.priEmail;
        }
    }

    function callUser() {

        if(!$onCall) {

            console.log("Making call To " + chatUser);

            calleeName.set(chatUser); calleeID.set(userID);

            callerName.set($currUser.profile.name); callerID.set($currUser.profile.email);

            showCallBar.set(true); showCallee.set(true); 

            navigator.mediaDevices.getUserMedia({video: false, audio: true})
            .then((stream) => {

                console.log("Creating Peer");

                setInterval(blink_text, 1000);

                setTimeout(function() {
                    window.$( "#stream" ).draggable();
                }, 1000);

                peer.set(new SimplePeer({
                    initiator: true,
                    trickle:false,
                    stream: stream
                }));

                $peer.on("signal", data => {
                    if(!$onCall) {
                        console.log("Receiving Signal");
                        $currSocket.emit('call-user', { 
                            calleeID: userID, 
                            calleeName: chatUser,  
                            signal: data, 
                            callerName: $currUser.profile.name, 
                            callerID: $currUser.profile.email 
                        });
                    }
                });

                $peer.on('stream', stream => {
                    console.log("Sending Stream");
                    showPlayer.set(true); showCallBar.set(false), showCallee.set(false); 
                    setTimeout(function() {
                        let audio = document.getElementById("audio");
                        audio.srcObject = stream;
                        onCall.set(true);
                    }, 500);
                });
            })
            .catch((err) => { console.log(err) });
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
                chatID: chatID,
                userID: userID,
                func: "saveChat",
                id: $currUser.profile.email,
                msg: {
                    msgid: $currUser.profile.email,
                    date: moment().format("YYYYMMDD, HH:mm"),
                    message: message
                }
            }

            $currSocket.emit('send-msg', currMsg);

            message = '';
        }
    }

    function inputStatus() {
        if(message == '') {
            $currSocket.emit('no-typing', userID);
        } else {
            $currSocket.emit('typing', userID);
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
                    <img alt="propic" src="{chat.priName == $currUser.profile.name ? 'https://api.adorable.io/avatars/285/' + chat.secEmail + '.png' : 'https://api.adorable.io/avatars/285/' + chat.priEmail + '.png'}"/>
                    <div class="chatPrev">
                        <h5 style="text-align:left;margin-bottom:0px;">{chat.priName == $currUser.profile.name ? chat.secName.toUpperCase() : chat.priName.toUpperCase()}
                            {#if chat.online}
                                <span class="indicator online"></span>
                            {/if}
                        </h5>
                        {#if chat.history.length > 0}
                            <p style="font-weight:lighter;font-size:15px;text-align:left;">{chat.history[chat.history.length - 1].message}</p>
                            <p style="font-weight:lighter;font-size:15px;text-align:right;">{getTimeSpan(chat.history[chat.history.length - 1].date)}</p>
                        {/if}
                    </div>
                </button>
            {/each}
        </div>
        <div id="currChat">
            <h4 style="text-align:center;color:white;">
                <button class="btn btn-dark chatHead" style="float:left;border-radius:0;" on:click="{viewStatsOrChats}">
                    {#if $ratio < 1}
                        <i class="fa fa-arrow-left"></i>
                        Back
                    {:else}
                        Versus Stats
                    {/if}
                </button> 
                    {chatUser.toUpperCase()}
                <button class="btn btn-dark chatHead" style="float:right;border-radius:0 0.4rem 0 0;">Request Game</button>
            </h4>
            <div class="scrollable container" bind:this={div}>
                {#each chatMsgs as msg, i}
                    {#if msg.msgid == $currUser.email}
                        <article class="myMsg">
                            <span class="txtMsg">{msg.message}</span>
                            {#if i < chatMsgs.length - 1}
                                {#if chatMsgs[i + 1].date != chatMsgs[i].date}
                                    <p style="font-size:10px;">{getTimeSpan(msg.date)}</p>
                                {/if}
                            {:else}
                                <p style="font-size:10px;">{getTimeSpan(msg.date)}</p>
                            {/if}
                        </article>
                    {:else}
                        <article class="odaMsg">
                            <span class="txtMsg">{msg.message}</span>
                            {#if i < chatMsgs.length - 1}
                                {#if chatMsgs[i + 1].date != chatMsgs[i].date}
                                    <p style="font-size:10px;">{getTimeSpan(msg.date)}</p>
                                {/if}
                            {:else}
                                <p style="font-size:10px;">{getTimeSpan(msg.date)}</p>
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
            <div class="input-group mb-3">
                {#if $showPlayer && ($callerName != null || $calleeName != null) && ($calleeName == chatUser || $callerName == chatUser)}
                    <Player/>
                {/if}
                <button class="btn btn-light btn-file camera" on:click="{callUser}" disabled="{!currChat.online && !$onCall}">
                    <i class="fa fa-phone"></i>
                </button> 
                <input autocomplete="off" id="user-msg" class="form-control" placeholder="Type Here" bind:value="{message}" on:keyup="{inputStatus}" on:keydown="{event => event.which === 13 && sendMsg()}"/>
                <button class="btn btn-light plane" on:click="{sendMsg}"><i class="fa fa-paper-plane-o"></i></button> 
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

    [hidden] {
        display: none !important;
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
        border-radius:1em 0 0 0 ;
        border-bottom:1px solid white;
    }

    .chatPrev {
        float:right;
        height:100%;
        width:calc(100% - 100px);
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
        max-height:85%;
    }

    #isTypingSpan {
        color: white;
        background:#eee;
        opacity: 65;
    }

    .input-group {
        position:absolute;
        bottom:0;
        background-color:#343a40;
        width:95%;
        left:2.5%;
        height:65px;
    }

    .camera {
        width:10%;
        border-radius:1em 0 0 1em;
        position:absolute;
        bottom:0;
    }

    .plane {
        width:10%;
        border-radius:0 1em 1em 0;
        position:absolute;
        bottom:0;
        right:0;
    }
    
    #user-msg {
        outline:none;
        border:none;
        position:absolute;
        bottom:0;
        width:80%;
        margin-left:10%;
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
            margin-left:10%;
            width:90%;
            border-radius:0 1em 1em 0;
        }

        .input-group {
            position:absolute;
            bottom:0;
            background-color:#343a40;
            width:95%;
            left:2.5%;
        }

        .plane {
            display:none;
        }

        .camera {
            width:10%;
        }

        .chatPrev {
            width:75%;
        }
    }
</style>