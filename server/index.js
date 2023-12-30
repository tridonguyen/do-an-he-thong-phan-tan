const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const cors = require('cors');
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
app.use(cors())
const user = {

}

let sum = 0

io.on('connection', (socket) => {
    console.log('A user connected. Socket ID:', socket.id);
    const id = socket.id
    user[`${id}`] = {

    }
    socket.emit('return_id_connect', socket.id)
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('another-left', user[`${id}`].name)
        delete user[`${id}`];

        if(user == {}){
            sum = 0
        }
    });

    socket.on('client-message', (message) => {
        console.log('Received message from client:', message);
        io.emit('server-message', `Server received: ${message}`);
    });


    //receiver number
    socket.on('client-send-number', (message) => {
        const received = parseInt(message)
        let success = false
        if(received <= 10 && received >=1){
            sum += received
            success = true
        }
        io.emit('message-from-another', {
            name: user[`${id}`].name,
            address: user[`${id}`].address,
            time: new Date(),
            id: socket.id,
            message: message,
            success:success
        })
        io.emit('server-sum', sum);
    });
    console.log('another address:', socket.handshake.address);

    socket.on('login', name => {
        console.log('another user login:', name);
        user[`${id}`].name = name
        user[`${id}`].address = socket.handshake.address
        socket.emit('another-join', name)
    })

});


server.listen(5000, () => {
    console.log('server running at http://localhost:5000');
});