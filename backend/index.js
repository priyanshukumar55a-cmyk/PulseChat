const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io")
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const cors = require("cors");

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const userRouter = require('./Routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRouters = require('./routes/messageRoutes');
require('colors');
dotenv.config();

connectDB();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRouter);
app.use('/api/user', userRouter)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRouters)

app.use(notFound);
app.use(errorHandler)


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("connected to socket.io")

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected')
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('user joined room: ' + room)
  })

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users is not defined")
    
    chat.users.forEach(user => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived)
    });
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold);
});
