const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function (req, res) {
    res.sendFile('index.html', {
        root: __dirname
    });
});

//catching the interrupt signal which is Ctrl+C 
process.on('SIGINT', function () {
    console.log("Caught interrupt signal");
    wss.clients.forEach(function each(client) {
        client.close();
    });
    server.close(() => {
        shutdownDB();
    });

})

server.on('request', app);

server.listen(3000, function () {
    console.log("Server started on port 3000")
})

//Begin websockets wohoo
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({
    server: server
});

wss.on('connection', function connection(ws) {

    const numClients = wss.clients.size;
    console.log("Clients connected: " + numClients);
    wss.broadcast("New client connected. Total clients: " + numClients);
    if (ws.readyState === ws.OPEN) {
        ws.send("Welcome to the chat room!");
    }
    db.run(`INSERT INTO visitors (count, time) VALUES (${numClients}, datetime('now'))`);

    ws.on('close', function close() {
        console.log("Client disconnected");
        wss.broadcast("Client disconnected. Total clients: " + wss.clients.size);
    })

});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
}

//end websockets

//begin database code yipee
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:'); // Create an in-memory database

// this command runs before any other command to ensure the database is ready to be used.
db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
            `)
})

function getCounts() {
    db.each(
        "SELECT * FROM visitors", (err, row) => {
            console.log(row);
        }
    )
}

function shutdownDB() {
    console.log("Getting counts from database");
    getCounts();
    console.log("Shutting down database");
    db.close();
}