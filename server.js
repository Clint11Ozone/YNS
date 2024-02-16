// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);
// const WebSocket = require('ws');

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// http.listen(3000, () => {
//     console.log('Server is listening at http://localhost:3000');
// });

// const wss = new WebSocket.Server({ server: http });

// wss.on('connection', function connection(ws) {
//     console.log('Client connected');
//     ws.on('close', function () {
//         console.log('Client disconnected');
//     });
// });

// module.exports = { wss };
