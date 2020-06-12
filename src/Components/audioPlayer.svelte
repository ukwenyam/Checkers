<script>
    import { callerName, calleeName, onCall, currentTime, showCallBar, showPlayer } from '../Scripts/Init.js';

    function enlargePlayer() {
        showPlayer.set(false);
        showCallBar.set(true);
    }
</script>

<div id="backplayer" on:click="{enlargePlayer}">
    <p id="time">On Call With {$callerName != null ? $callerName : $calleeName} {$currentTime}</p>
    <audio id="audio" autoplay controls hidden></audio>
</div>

<style>
    #audio {
        width:100%;
        height:100%;
    }

    #time {
        text-align:center;
        color:white;
        margin-top:0;
        margin-bottom:0;
    }

    #backplayer {
        background-color:red;
        height:25px;
        width:100%;
        border-radius:1em;
    }
</style>