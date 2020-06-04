const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const PORT = process.env.PORT || 4000;
const fetch = require("node-fetch");

function invokeFunction(load) {
    return new Promise((resolve, reject) => {

        const url = "https://us-central1-checker-io.cloudfunctions.net/" + load.func;
        //load = new URLSearchParams(load).toString();

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(load),
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        })
        .then(res => 
            res.json()
        )
        .then(json => {
            resolve(json)
        })
        .catch(err => 
            reject(err)
        );
    });
}

const server = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('view engine', 'html')
  .get('/', (req, res) => res.render('public/index.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const io = socketio(server);

const MAX_ROOM_USER = 2;

let rooms = new Map();

var userCount = 0;

io.on('connection', (socket) => {
    ++userCount;
    console.log("New Client connected!");

    socket.on('disconnect', () => {
        if(userCount > 0){
            --userCount;
        }
        console.log("Client has left");
    })

    socket.on('set-username', (name) => {
        console.log('Setting username to '+name);
        socket.username = name;
    });

    socket.on('join-room', (room, username) => {
        if(rooms.has(room) && rooms.get(room) < MAX_ROOM_USER) {
            rooms.set(room, 2);
            console.log(username + ' has arrived!');
            socket.to(room).emit('second-user', username);
        } 
        if(!rooms.has(room)) {
            rooms.set(room, 1);
            console.log(username + ' has arrived!');
        }
        socket.join(room);
    });

    socket.on('first-user', (data) => {
        console.log('send back first player ' + data.name);
        socket.to(data.room).emit('first-user', data.name);
    });

    socket.on('chat message', (data) => {
        console.log('Somebody sent chat: ' + data.msg);
        io.to(data.room).emit('chat message', data);
    });

    socket.on('piece-move', (data) => {
        console.log(socket.username + ' made a move.');
        socket.to(data.room).emit('piece-move', data);
    });

    socket.on('typing', (room) => {
        console.log(socket.username + ' is typing');
        socket.to(room).emit('typing', room);
    });

    socket.on('no-typing', (room) => {
        console.log(socket.username + ' is no longer typing');
        socket.to(room).emit('no-typing', room);
    });

    socket.on('current-player', (data) => {
        console.log('sending currplayer '+ data.player);
        socket.to(data.room).emit('current-player', data.player);
    });

    socket.on('paused', (data) => {
        console.log('Game Paused: ' + data.paused);
        socket.to(data.room).emit('paused', data.paused);
    });

    socket.on('save-game', (data) => {
        invokeFunction(data).then((response) => {
            response.auto = data.auto;
            if(!data.saved)
                socket.to(data.gameID).emit('saveGame', response);
        }).catch((error) => {
            console.log("Error " + error);
            if(!data.saved)
                socket.to(data.gameID).emit('saveGame', error);
        });
    });

    socket.on('save-chat', (data) => {
        invokeFunction(data).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log("Error " + error);
        });
    });
});    