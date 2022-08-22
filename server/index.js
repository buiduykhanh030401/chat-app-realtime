const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const messagesRoutes = require("./routes/messagesRoute")
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);

// const URI = 'mongodb+srv://admin:duykhanh651@cluster0.nmguflc.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connection Successfull");
}).catch((err) => {
    console.log(err.message);
});
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log("DB Connection Successfull");
// }).catch((err) => {
//     console.log(err.message);
// });

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credential: true
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })
})