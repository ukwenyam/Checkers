<script>
    import { gamePref, gameBoard, currSocket, gameHistory, peer, showCallee, showCallBar, callerSignal, onCall, gameMoves,
            gameTab, page, currUser, allChats, viewCreateGame, smallPopUp, callerName, callerID, showCaller, showPlayer } from '../Scripts/Init.js';
    import { getAllChats, blink_text, getUserGames, normalizeState } from '../Scripts/Functions.js';
    import Notify from './Notification.svelte';

    let i, showNotify = false;
    let header, body, icon;
    let closeNotify = () => { showNotify = false }

    $currSocket.on('online-user', (data) => {

        if($currUser != null && $currUser.isAuth && $allChats != null && $allChats.length > 0 && data != $currUser.profile.email) {
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

            $currSocket.emit('go-online', $currUser.profile.email);
        }
    });

    $currSocket.on('offline-user', (data) => {

        if($currUser != null && $currUser.isAuth && $allChats != null && $allChats.length > 0 && data != $currUser.profile.email) {
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

            $currSocket.emit('go-online', $currUser.profile.email);
        }
    });

    $currSocket.on('recv-msg', async (data) => {

        if(data.userID == $currUser.profile.email || data.id == $currUser.profile.email) {
            console.log('Received: ' + data.msg.message);
            for(i = 0; i < $allChats.length; i++) {
                if($allChats[i].id == data.chatID) {
                    allChats.update(state => {
                        state[i].history.push(data.msg);
                        return state;
                    });
                    break;
                }
            }

            if(data.userID == $currUser.profile.email) {
                header = $allChats[i].priEmail == $currUser.email ? $allChats[i].secName.toUpperCase() : $allChats[i].priName.toUpperCase();
                body = data.msg.message;
                icon = $allChats[i].priEmail == $currUser.profile.email ? 'https://api.adorable.io/avatars/285/' + $allChats[i].secEmail + '.png' : 'https://api.adorable.io/avatars/285/' + $allChats[i].priEmail + '.png';
                showNotify = true;
                setTimeout(closeNotify, 3000);
            }

            if($allChats.length > 1 && i != 0) {
                allChats.update(state => {
                    let latestChat = state[i];
                    for(let j = i; j >= 0; j--) 
                        state[j] = state[j - 1];
                    state[0] = latestChat;
                    return state;
                });
            }
        }
    });

    $currSocket.on('recv-call', (data) => {

        if(data.calleeID == $currUser.profile.email && !$onCall) {
            console.log("receving call from " + data.callerName);
            callerName.set(data.callerName);
            callerID.set(data.callerID);
            callerSignal.set(data.signal);

            if(!$onCall) {
                showCallBar.set(true); showCaller.set(true);
                setInterval(blink_text, 1000);
                setTimeout(function() {
                    window.$("#stream").draggable();
                }, 1000);
            }
        } 
    });

    $currSocket.on('call-accepted', data => {

        if(data.callerID == $currUser.profile.email && !$onCall) {
            console.log("Call Accepted");
            showCallee.set(false); showCallBar.set(false);
            $peer.signal(data.signal);
        }
    });

    $currSocket.on('end-call', data => {

        if(data.callerID == $currUser.profile.email || data.calleeID == $currUser.profile.email) {
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

    $currSocket.on('get-second-user', (data) => {

        if(data.gameID == $gamePref.gameID && $gamePref.oppID == null && $gamePref.opp == null && $gamePref.currPlayer != null) {

            console.log('Received second player');

            gamePref.update(state => {
                state.opp = data.name;
                state.oppID = data.email;
                return state;
            });

            getAllChats();

            $currSocket.emit('send-first-user', { gameID: $gamePref.gameID, name: $currUser.profile.name });

            viewCreateGame.set(false); smallPopUp.set(false);

            gameTab.set(5);
        }
    });

    $currSocket.on('get-first-user', (data) => {

        if(data.gameID == $gamePref.gameID && $gamePref.opp == null && $gamePref.currPlayer != null) {

            console.log('Received first player');
            gamePref.update(state => {
                state.opp = data.name;
                return state;
            });

            getAllChats();

            gameTab.set(5);
        }
    });

    $currSocket.on('start-game', (gameID) => {

        if($gamePref != null && gameID == $gamePref.gameID) {
            console.log("Game Started");
            gamePref.update(state => {
                state.paused = false;
                return state;
            });

            header = $gamePref.gameID + " Game";
            body = "Game with " + $gamePref.opp + " has started";
            icon = "images/LOGO-192.png";
            showNotify = true;
            setTimeout(closeNotify, 3000);
        }
    });

    $currSocket.on('game-save', (data) => {

		if(data.gameID == $gamePref.gameID) {

            if(data.oppID == $currUser.email) {
                header = $gamePref.gameID + " Game";
                body = $gamePref.opp + " is Saving Game";
                icon = "images/LOGO-192.png";
                showNotify = true;
                setTimeout(closeNotify, 3000);
            }

            console.log("Game Saved");
            
            let gameState = []

            for(let i = 0; i < $gameHistory.length; i++) {
                let { state, pieceId } = normalizeState($gameHistory[i]);
                gameState.push({ board: state, move: $gameMoves[i], gameIds: pieceId });
            }

			let request = {
				func: "saveGame",
				id: $currUser.profile.email,
				gameID: $gamePref.gameID,
				initiator: $gamePref.initiator,
				gameHistory: gameState,
				myMoves: $gamePref.myMoves,
				minutes: Math.ceil($gamePref.secondsPlayed / 60),
				currPlayer: $gamePref.currPlayer
			}

			$currSocket.emit('save-game', request);

			if(!data.auto)
				gamePref.set(null);
		}
    });

    $currSocket.on('refresh-list', () => {
        console.log("Refreshing Game list");
        if($currUser != null && $currUser.isAuth)
            getUserGames()
    });
</script>

{#if showNotify}
    <Notify header={header} body={body} icon={icon}/>
{/if}