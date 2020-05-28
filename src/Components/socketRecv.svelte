<script>
    import { gamePref, gameBoard, currSocket, gameHistory, gameChat, gameTab } from '../Scripts/Init.js';

    $currSocket.on('chat message', (data) => {

        console.log('Received: '+data.msg);

        gameChat.update(state => {
            state.push(data);
            return state;
        });
    });

    $currSocket.on('second-user', (data) => {

        if($gamePref.sec == null && $gamePref.currPlayer != null) {

            console.log('Received other username');

            gamePref.update(state => {
                state.sec = data;
                return state;
            });

            $currSocket.emit('current-player', {player: $gamePref.currPlayer, room: $gamePref.id});

            gameChat.set([]); 
            
            if(screen.width < 800) gameTab.set(0); 
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
</script>