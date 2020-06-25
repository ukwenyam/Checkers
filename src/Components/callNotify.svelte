<script>
    import { onCall, showCaller, showCallee, callerName, calleeName, peer, calleeID, 
            currSocket, callerSignal, showCallBar, callerID, showPlayer, currentTime } from '../Scripts/Init.js';
    import Player from './audioPlayer.svelte';
    
    function acceptCall() {

        showCaller.set(false), showCallBar.set(false);

        navigator.mediaDevices.getUserMedia({video: false, audio: true})
        .then((stream) => {

            let simplePeer = new SimplePeer({
                initiator: false,
                trickle:false,
                stream: stream
            });

            peer.update(state => {
                state = simplePeer;
                return state;
            });

            simplePeer.on("signal", data => {
                console.log("Receiving Signal");
                $currSocket.emit('accept-call', { signal: data, callerID: $callerID });
            });

            simplePeer.on('stream', stream => {
                console.log("Sending Stream");
                showPlayer.set(true);
                setTimeout(function() {
                    let audio = document.getElementById("audio");
                    audio.srcObject = stream;
                    onCall.set(true);
                }, 500);
            });

            simplePeer.signal($callerSignal);
        })
        .catch((err) => { console.log(err) });
    }

    function hidePlayer() {
        showPlayer.set(true);
        showCallBar.set(false);
    }

    function endCall() {
        if($onCall) {
            let audio = document.getElementById("audio");
            audio.src = "";
            onCall.set(false);
            $peer.destroy();

            if($showPlayer)
                showPlayer.set(false);
        }
    
        $currSocket.emit('end-call', { calleeID: $calleeID, callerID: $callerID });
        showCallBar.set(false);
    }
</script>

<div id="stream">
    {#if $onCall}
        <div id="player">
            <Player/>
        </div>
        <button class="btn btn-info btn-sm accept" on:click="{hidePlayer}">Hide</button>
        <button class="btn btn-danger btn-sm decline" on:click="{endCall}">End Call</button>
    {/if}

    {#if $showCaller}
        <h3 class="blink">{$callerName.toUpperCase()} is Calling</h3>
        <button class="btn btn-success btn-sm accept" on:click="{acceptCall}">Accept</button>
        <button class="btn btn-danger btn-sm decline" on:click="{endCall}">Decline</button>
    {/if}

    {#if $showCallee}
        <h3 class="blink">Calling {$calleeName.toUpperCase()}</h3>
        <button id="cancel" class="btn btn-danger btn-sm" on:click="{endCall}">Cancel</button>
    {/if}
</div>

<style>
    .accept {
        width:40%;
        float:left;
        margin-left:10px;
    }

    .decline {
        width:40%;
        float:right;
        margin-right:10px;
    }

    #cancel {
        width:50%;
        margin-left:25%;
    }

    #stream {
        position:fixed;
        right:5px;
        bottom:5px;
        width:300px;
        height:100px;
        border-radius:0.4rem;
        background-color:rgba(0, 0, 0, .6);
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);  
        z-index:101;
        backdrop-filter: blur(5px);
        color:white;
        cursor:pointer;
    }

    h3, #player {
        text-align:center;
        margin-top:10px;
        margin-bottom:10px;
        width:90%;
        margin-left:5%;
    }

    @media screen and (max-width: 800px) {
        #stream {
            width:97.5%;
            bottom:65px;
        }
    }
</style>