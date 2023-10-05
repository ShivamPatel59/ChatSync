const express = require('express');
const chats = require('./data/data');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();


connectDB();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send('Server is ready');
    }
);
app.get("/api/chats", (req, res) => {
    res.send(chats);
});

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/chat', require('./routes/chatRoutes'))
app.use("/api/message", require("./routes/messageRoutes"));

app.use(notFound);
app.use(errorHandler);


 const server=   app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

    const io = require('socket.io')(server, {
        pingTimeout: 60000,
        cors: {
            origin: '*',
        },
    });

    io.on("connection", (socket) => {
        console.log("connected to socket.io");

        socket.on('setup', (userData) => {
            socket.join(userData._id);
            // console. log(userData._id);
            socket.emit('connected');
        }) ;

        socket.on('join chat', (room) =>{
            socket.join(room);
            console.log("Joined Room : ",room);
        });

        socket.on('typing', (room) =>{
            socket.in(room).emit('typing');
        });

        socket.on('stop typing', (room) =>{
            socket.in(room).emit('stop typing');
        }
        );

        //new message
        socket.on('new message', (newMessageRecieved) =>{
            var chat = newMessageRecieved.chat;
            if(!chat.users) return console.log("Chat.users not defined");

            chat.users.forEach((user) =>{
                if(user._id == newMessageRecieved.sender._id) return;
                socket
                  .in(user._id)
                  .emit("message received", newMessageRecieved);
            });
        });

        socket.off("setup",()=>{
            console.log("disconnected from socket.io");
            socket.leave(userData._id)
        })
    });
