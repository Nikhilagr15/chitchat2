const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoute = require('./routes/messageRoute');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const path = require('path')

dotenv.config();
connectDB();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const origin = `http://${HOST}:3000`

const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));

    next();
})
app.use(express.json());

// ---------------------deployment-------------------------------
const dir = path.resolve()
console.log("NODE_ENV: ", process.env.NODE_ENV)
console.log("path.join(dir, chitchat/build) : ", path.join(dir, "chitchat/build"))
console.log("path.resolve(dir, chitchat, build, index.html) : ", path.resolve(dir, "chitchat", "build", "index.html"))
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(dir, "chitchat/build")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(dir, "chitchat", "build", "index.html"))
    })
} else {
    app.get('/', (req, res) => {
        res.send({ name: 'Welcome to Chit-Chat' });
    });

}



// ---------------------deployment-------------------------------



app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoute);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, HOST, () => console.log(`listening on port ${PORT}`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: origin
    }
})

io.on("connection", socket => {
    socket.on("setup", user => {
        if (user && user._id) {
            socket.join(user._id);
            socket.emit("connected");
            console.log("socket connected user: ", user._id);
        } else {
            console.error("User ID is undefined");
        }
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined the room.", room)
    })

    socket.on("new message", (message) => {
        const { chat, sender } = message;
        chat.users.forEach(usr => {
            if (usr._id !== sender._id) {
                io.to(usr._id).emit("message received", message)
            }
        });
    })
})