const express = require('express')
const bodyparser = require('body-parser');
const cors = require('cors');
// const mysql = require('mysql')
const dbconfig = require('./dbcon')
const path = require('path');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

//db connection
let con = dbconfig.connection;

const port = 3000;

app.use(express.static('app'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use(bodyparser.json());
app.use(cors());

app.use('/auth', require('./routes/auth'));
app.use('/fetch', require('./routes/fetch'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + './app/index.html');
})

// fuctoion for socket
let clientSocketIds = [];
let connectedUsers = [];

const getSocketByUserId = (userId) => {
    let socket = "";
    for (let i = 0; i < clientSocketIds.length; i++) {
        if (clientSocketIds[i].userId == userId) {
            socket = clientSocketIds[i].socket;
            break;
        }
    }
    return socket;
}

//founction for saving msg to database
function saveMsg2db(msg_obj) {
    let sql = `INSERT INTO messages (message, sender_id, receiver_id) VALUES (${con.escape(msg_obj.msg)}, ${con.escape(msg_obj.from)}, ${con.escape(msg_obj.to)})`;
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Message added to db");
        }
    })
}

io.on("connection", (socket) => {
    console.log("Connected socket id : " + socket.id);
    socket.on("disconnect", () => {
        console.log("Disconnected socket id : " + socket.id)
        connectedUsers = connectedUsers.filter(item => item.socketId != socket.id);
        io.emit('userListUpdate', connectedUsers)
    })

    socket.on("loggedin", (user) => {
        clientSocketIds.push({ socket: socket, userId: user.id })
        connectedUsers = connectedUsers.filter(item => item.id != user.id)
        connectedUsers.push({ ...user, socketId: socket.id })
        io.emit("userListUpdate", connectedUsers);
    })

    socket.on("message", (msg_data) => {
        //save msg to db
        //console.log(msg_data)
        saveMsg2db(msg_data);
        let receiver_sock = getSocketByUserId(msg_data.to)
        // console.log("rec sock: " + receiver_sock.id);
        socket.to(receiver_sock.id).emit("message", msg_data);
        console.log(`Message sent to id: ${msg_data.to} > socket: ${receiver_sock.id} `)
    })
})

server.listen(port, () => {
    console.log(`ByteFly server listening on port ${port}`)
})