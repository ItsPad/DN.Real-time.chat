const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let userCount = 0; // เพิ่มตัวแปรนับจำนวนผู้ใช้

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//user count 
io.on('connection', (socket) => {
    userCount++;
    io.emit('user count', userCount);

    let username = 'Anonymous';

    socket.on('username', (name) => {
        username = name;
        console.log(`${username} connected`);
    });

    socket.on('chat message', (msgObject) => {
        io.emit('chat message', msgObject);
    });

    // 📌 บอกทุกคนว่ามีคนกำลังพิมพ์
    socket.on('typing', (name) => {
        socket.broadcast.emit('typing', name); 
    });

    // 📌 หยุดบอกเมื่อเลิกพิมพ์
    socket.on('stop typing', (name) => {
        socket.broadcast.emit('stop typing', name);
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('user count', userCount);
        console.log(`${username} disconnected`);
        io.emit('disconnected', `${username} disconnected`);
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

