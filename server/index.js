const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors')
const router = require('./router')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app)

const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
    },
})

app.use(cors());
app.use(router)

//connection is a built in key word, which runs when we have a client connection on our io instance.

io.on('connection', (socket) => {
    console.log('We have a new connection!');

    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`})

        socket.join(user.room);

        //if no errors, it will not pass anything so will not run on front end as it needs an arg.
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message});

        callback();
    })

    socket.on('disconnect', () => {
        console.log('User had left!!!');
    })
})


server.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
});