const express = require('express');
const socketio = require('socket.io');
//const http = require('http');

const PORT = process.env.PORT || 4000;
const INDEX = '../public/index.html';

const server = express().use((req, res) => res.sendFile(INDEX, { root: __dirname})).listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
});

const io = socketio(server);

const MAX_ROOM_USER = 2;

var rooms = new Map();

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

});    