<script>
    import { gamePref, gameBoard, currSocket, gameHistory, gameChat, gameTab, page, currUser, allChats } from '../Scripts/Init.js';

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

        console.log($allChats);

        let request = {
            func: "saveChat",
            id: $currUser.email,
            chatID: $allChats[index].id,
            history: $allChats[index].history
        }

        //console.log(request);

        $currSocket.emit('save-chat', request);
    });

    $currSocket.on('second-user', (data) => {

        if($gamePref.sec == null && $gamePref.currPlayer != null) {

            console.log('Received second player');

            gamePref.update(state => {
                state.sec = data;
                return state;
            });

            $currSocket.emit('current-player', {player: $gamePref.currPlayer, room: $gamePref.gameID});

            $currSocket.emit('first-user', { room: $gamePref.gameID, name: $currUser.name });

            if(screen.width < 800) 
                gameTab.set(0);
        }
    });

    $currSocket.on('first-user', (data) => {

        if($gamePref.pri == null && $gamePref.currPlayer != null) {

            console.log('Received first player');

            gamePref.update(state => {
                state.pri = data;
                return state;
            });

            $currSocket.emit('current-player', {player: $gamePref.currPlayer, room: $gamePref.gameID});

            if(screen.width < 800) 
                gameTab.set(0);
        }
    });

    $currSocket.on('current-player', (data) => {

        console.log('Received current player');

        gamePref.update(state => {
            state.timer = state.time;
            state.currPlayer = data;
            return state;
        });

        console.log($gamePref.currPlayer);
	});

    $currSocket.on('paused', (data) => {

        gamePref.update(state => {
            state.paused = data;
            return state;
        });
    });

    $currSocket.on('saveGame', (data) => {

        let request = {
            func: "saveGame",
            id: $currUser.email,
            gameID: $gamePref.id,
            gameHistory: $gameHistory,
            pri: $gamePref.pri == $currUser.name ? true : false,
            sec: $gamePref.sec == $currUser.name ? true : false,
            minutes: Math.floor($gamePref.secondsPlayed / 60),
            currPlayer: $gamePref.currPlayer,
            auto: data.auto,
            saved: true
        }

        $currSocket.emit('save-game', request);

        if(!data.auto) page.set(0);
    });
</script>