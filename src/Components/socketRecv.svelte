<script>
    import { gamePref, gameBoard, currSocket, gameHistory, 
            gameTab, page, currUser, allChats, viewCreateGame, smallPopUp } from '../Scripts/Init.js';
    import { getAllChats } from '../Scripts/Functions.js';

    $currSocket.on('chat message', (data) => {

        console.log('Received: ' + data.msg);

        let i, index;

        for(i = 0; i < $allChats.length; i++) {
            if($allChats[i].id == data.chatID) {
                allChats.update(state => {
                    state[i].history.push(data);
                    return state;
                });
                index = i;
                break;
            }
        }

        let request = {
            func: "saveChat",
            id: $currUser.email,
            chatID: $allChats[index].id,
            history: $allChats[index].history
        }

        $currSocket.emit('save-chat', request);
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