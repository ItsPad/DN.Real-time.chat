const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let userCount = 0; // เพิ่มตัวแปรนับจำนวนผู้ใช้

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    userCount++; // เพิ่มเมื่อมีผู้ใช้เชื่อมต่อ
    io.emit('user count', userCount); // แจ้งทุกคน

    let username = 'Anonymous';

    socket.on('username', (name) => {
        username = name;
        console.log(`${username} connected`);
    });

    socket.on('chat message', (msgObject) => {
        io.emit('chat message', msgObject);
    });

    socket.on('disconnect', () => {
        userCount--; // ลดเมื่อผู้ใช้ disconnect
        io.emit('user count', userCount); // แจ้งทุกคน
        console.log(`${username} disconnected`);
        io.emit('disconnected', `${username} disconnected`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

