<script>
    import { gamePref, gameBoard, currSocket, gameHistory, peer, showCallee, showCallBar, callerSignal, onCall,
            gameTab, page, currUser, allChats, viewCreateGame, smallPopUp, callerName, callerID, showCaller, showPlayer } from '../Scripts/Init.js';
    import { getAllChats, blink_text } from '../Scripts/Functions.js';


    $currSocket.on('online-user', (data) => {

        let i;
        if($currUser != null && $currUser.isAuth && $allChats != null && $allChats.length > 0 && data != $currUser.email) {
            for(i = 0; i < $allChats.length; i++) {
                if(($allChats[i].priEmail == data || $allChats[i].secEmail == data) && !$allChats[i].online) {
                    allChats.update(state => {
                        state[i].online = true;
                        return state;
                    });

                    break;
                } 

                if(($allChats[i].priEmail == data || $allChats[i].secEmail == data) && $allChats[i].online) {
                    break;
                } 
            }

            $currSocket.emit('go-online', $currUser.email);
        }
    });

    $currSocket.on('offline-user', (data) => {

        let i;
        if($currUser != null && $currUser.isAuth && $allChats != null && $allChats.length > 0 && data != $currUser.email) {
            for(i = 0; i < $allChats.length; i++) {
                if(($allChats[i].priEmail == data || $allChats[i].secEmail == data) && $allChats[i].online) {
                    allChats.update(state => {
                        state[i].online = false;
                        return state;
                    });

                    break;
                } 

                if(($allChats[i].priEmail == data || $allChats[i].secEmail == data) && !$allChats[i].online) {
                    break;
                } 
            }

            $currSocket.emit('go-online', $currUser.email);
        }
    });

    $currSocket.on('recv-msg', async (data) => {

        if(data.userID == $currUser.email || data.id == $currUser.email) {
            console.log('Received: ' + data.msg.message);
            let i;
            for(i = 0; i < $allChats.length; i++) {
                if($allChats[i].id == data.chatID) {
                    allChats.update(state => {
                        state[i].history.push(data.msg);
                        return state;
                    });
                    break;
                }
            }
        }
    });

    $currSocket.on('recv-call', (data) => {

        if(data.calleeID == $currUser.email && !$onCall) {
            console.log("receving call from " + data.callerName);
            callerName.set(data.callerName);
            callerID.set(data.callerID);
            callerSignal.set(data.signal);

            if(!$onCall) {
                showCallBar.set(true); 
                showCaller.set(true);
                setInterval(blink_text, 1000);
                setTimeout(function() {
                    window.$("#stream").draggable();
                }, 1000);
            }
        } 
    });

    $currSocket.on('call-accepted', data => {

        if(data.callerID == $currUser.email && !$onCall) {
            console.log("Call Accepted");
            showCallee.set(false), showCallBar.set(false);
            $peer.signal(data.signal);
        }
    });

    $currSocket.on('end-call', data => {

        if(data.callerID == $currUser.email || data.calleeID == $currUser.email) {
            console.log("Ending call");

            if($onCall) {
                let audio = document.getElementById("audio");
                audio.src = "";
                $peer.destroy();
                onCall.set(false);

                if($showPlayer)
                    showPlayer.set(false);
            }

            showCallBar.set(false);
        }
    });

    $currSocket.on('get-second-user', async (data) => {

        if($gamePref.sec == null && $gamePref.currPlayer != null) {

            console.log('Received second player');

            gamePref.update(state => {
                state.sec = data;
                return state;
            });

            await getAllChats();

            $currSocket.emit('send-first-user', { room: $gamePref.gameID, name: $currUser.name });

            viewCreateGame.set(false); smallPopUp.set(false);

            gameTab.set(2);
        }
    });

    $currSocket.on('get-first-user', (data) => {

        if($gamePref.pri == null && $gamePref.currPlayer != null) {

            console.log('Received first player');

            gamePref.update(state => {
                state.pri = data;
                return state;
            });

            gameTab.set(2);
        }
    });

    $currSocket.on('switch-player', () => {

        console.log('Switching Player');

        gamePref.update(state => {
            state.timer = state.time;
            state.currPlayer = state.currPlayer == "red" ? "black" : "red";;
            return state;
        });

        console.log($gamePref.currPlayer);
	});

    $currSocket.on('start-game', () => {

        console.log("Game Started");

        gamePref.update(state => {
            state.paused = false;
            return state;
        });
    });

    $currSocket.on('save-game', (data) => {

        console.log("Game Saved");

        let request = {
            func: "saveGame",
            id: $currUser.email,
            gameID: $gamePref.gameID,
            gameHistory: $gameHistory,
            priMoves: $gamePref.priMoves,
            secMoves: $gamePref.secMoves,
            minutes: Math.floor($gamePref.secondsPlayed / 60),
            currPlayer: $gamePref.currPlayer,
            auto: data.auto,
            saved: true
        }

        $currSocket.emit('save-game', request);

        if(!data.auto) { gamePref.set(null); }
    });
</script>