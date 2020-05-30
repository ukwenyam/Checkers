<script>
    import { gamePref, gameBoard, currSocket, gameHistory, gameChat, gameTab, page, currUser } from '../Scripts/Init.js';

    $currSocket.on('chat message', (data) => {

        console.log('Received: '+data.msg);

        gameChat.update(state => {
            state.push(data);
            return state;
        });
    });

    $currSocket.on('second-user', (data) => {

        if($gamePref.sec == null && $gamePref.currPlayer != null) {

            console.log('Received second player');

            gamePref.update(state => {
                state.sec = data;
                return state;
            });

            $currSocket.emit('current-player', {player: $gamePref.currPlayer, room: $gamePref.id});

            $currSocket.emit('first-user', { room: $gamePref.id, name: $currUser.name });

            if(screen.width < 800) 
                gameTab.set(0);
            else
                if($gameChat[0].msg.includes($gamePref.id))
                    gameChat.set([]);

        }
    });


    $currSocket.on('first-user', (data) => {

        if($gamePref.pri == null && $gamePref.currPlayer != null) {

            console.log('Received first player');

            gamePref.update(state => {
                state.pri = data;
                return state;
            });

            $currSocket.emit('current-player', {player: $gamePref.currPlayer, room: $gamePref.id});

            if(screen.width < 800) 
                gameTab.set(0);
            else
                if($gameChat[0].msg.includes($gamePref.id))
                    gameChat.set([]);
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
            gameID: $gamePref.id,
            gameHistory: JSON.stringify($gameHistory),
            chatHistory: JSON.stringify($gameChat),
            pri: $gamePref.pri == $currUser.name ? true : false,
            sec: $gamePref.sec == $currUser.name ? true : false,
            minutes: Math.floor($gamePref.secondsPlayed / 60),
            currPlayer: $gamePref.currPlayer,
            auto: data.auto,
            saved: true
        }

        $currSocket.emit('saveGame', request);

        if(!data.auto) page.set(0);
    });
</script>