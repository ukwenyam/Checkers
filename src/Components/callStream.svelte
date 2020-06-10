<script>
    import { peer, stream, currUser, showAudio, callee, showCallee, calleeName } from '../Scripts/Init.js';

    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    let showCaller = false, showCallStream = false, answered = false;
    
    let callerName;

    $peer.on('call', function(caller) {

        console.log("Receiving Call from " + caller.peer);

        callerName = caller.peer;

        showAudio.set(true), showCaller = true;

        getUserMedia({video: false, audio: true}, function(stream) {

            setInterval(function() {
                if(answered) {
                    caller.answer(stream);
                    caller.on('stream', function(remoteStream) {
                        showCaller = false, showCallStream = true;
                        setTimeout(function() {
                            let video = document.getElementById("player");
                            video.srcObject = remoteStream;
                            video.play();
                        }, 1000);
                    });
                }
            }, 1);
            
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    });

    setInterval(function() {
        if($callee != null) {
            $callee.on('stream', function(remoteStream) {
                showCallee.set(false), showCallStream = true;
                setTimeout(function() {
                    let video = document.getElementById("player");
                    video.srcObject = remoteStream;
                    video.play();
                }, 1000);
            });
        }
    }, 1);
</script>

{#if $showAudio}
	<div id="stream">
        {#if showCallStream}
            <audio id="player" controls autoplay></audio>
            <button id="cancel" class="btn btn-danger btn-sm">End Call</button>
        {:else if showCaller}
            <h3>{callerName} is Calling</h3>
            <button id="accept" class="btn btn-success btn-sm" on:click="{() => (answered = true)}">Accept</button>
            <button id="decline" class="btn btn-danger btn-sm">Decline</button>
        {:else if $showCallee}
            <h3>Calling {$calleeName}</h3>
            <button id="cancel" class="btn btn-danger btn-sm">Cancel</button>
        {/if}
    </div>
{/if}

<style>
    h3 {
        text-align:center;
        margin-top:10px;
        margin-bottom:10px;
    }

    audio {
        width:90%;
        margin-top:10px;
        margin-bottom:5px;
        margin-left:5%;
        height:30px;
        background-color:transparent; 
    }

    #accept {
        width:40%;
        float:left;
        margin-left:10px;
    }

    #decline {
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
    }

    @media screen and (max-width: 800px) {

        #stream {
            width:95%;
            top:5px;
            bottom:unset;
        }
    }
</style>