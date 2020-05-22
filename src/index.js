const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 4000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
});

var userCount = 0;

// var usersCount = 0;
// const MAX_ROOM_USER = 10;
// var userMap = new Map();
// var socs = [];
// var users = [];

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

    socket.on('join-room', (room) => {
        console.log(`${socket.username} joined the ${room} chat room`);
        socket.join(room);
    });

    socket.on('chat message', (data, room) => {
        console.log(`${socket.username} sent ${data} to room ${room}`);
        io.to(room).emit('chat message', data);
    });


  


});    