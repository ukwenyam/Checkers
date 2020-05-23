const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 4000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const MAX_ROOM_USER = 2;

var rooms = new Map();

app.use(router);

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
});

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
        if(rooms.has(room)){
            rooms.set(room, 2);
            console.log('other player arrived!');
            socket.to(room).emit('second-user', username);
        }
        else{
            rooms.set(room, 1);
        }
        console.log(`${socket.username} joined the ${room} chat room`);
        socket.join(room);
    });

    socket.on('chat message', (data) => {
        console.log('Somebody sent chat: ' + data.msg);
        io.to(data.room).emit('chat message', data);
    });

    socket.on('piece-move', (data) => {
        console.log(socket.username + ' made a move.');
        socket.to(data.room).emit('piece-move', data);
    });

});    