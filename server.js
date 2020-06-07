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
let stats = new Map();

var userCount = 0;

io.on('connection', (socket) => {
    ++userCount;
    console.log("New Client connected!");

    socket.on('go-online', (userID) => {
        stats.set(userID, true);
    });

    socket.on('go-offline', (userID) => {
        stats.set(userID, false);
    });

    socket.on('check-status', (userID) => {
        socket.emit('get-status', stats.get(userID));
    });

    socket.on('disconnect', () => {
        if(userCount > 0){
            --userCount;
        }
        console.log("Client has left");
    });

    socket.on('set-username', (name) => {
        console.log('Setting username to '+name);
        socket.username = name;
    });

    socket.on('join-room', (room, username) => {
        if(rooms.has(room) && rooms.get(room) < MAX_ROOM_USER) {
            rooms.set(room, 2);
            console.log(username + ' has arrived!');
            socket.to(room).emit('get-second-user', username);
        } 
        if(!rooms.has(room)) {
            rooms.set(room, 1);
            console.log(username + ' has arrived!');
        }
        socket.join(room);
    });

    socket.on('send-first-user', (data) => {
        console.log('send back first player ' + data.name);
        socket.to(data.room).emit('get-first-user', data.name);
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

    socket.on('switch-player', (room) => {
        console.log('switching player');
        socket.to(room).emit('switch-player');
    });

    socket.on('start-game', (room) => {
        console.log(room);
        console.log('Game has Started');
        socket.to(room).emit('start-game');
    });

    socket.on('save-game', (request) => {
        invokeFunction(request).then((response) => {
            console.log(response);
            if(!request.saved)
                socket.to(request.gameID).emit('save-game', response);
        }).catch((error) => {
            console.log("Error " + error);
        });
    });

    socket.on('save-chat', (request) => {
        invokeFunction(request).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log("Error " + error);
        });
    });
});    