const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const cors = require("cors");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const userRouter = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRouters = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
require("colors");
dotenv.config();

connectDB();

const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRouters);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

// keep track of currently connected user ids
let activeUsers = [];

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("setup", (userData) => {
    if (!userData || !userData._id) return;

    socket.join(userData._id);
    socket.userId = userData._id;

    // add to active users list
    if (!activeUsers.includes(userData._id)) {
      activeUsers.push(userData._id);
    }

    // notify this socket it's connected
    socket.emit("connected");

    // broadcast updated active users to all connected clients
    io.emit("active users", activeUsers);
  });

  socket.on("join chat", (room) => {
    console.log("user joined room: " + room);
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      activeUsers = activeUsers.filter((id) => id !== socket.userId);
      io.emit("active users", activeUsers);
    }

    // leave any rooms if needed
    if (socket.userId) socket.leave(socket.userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold);
});
