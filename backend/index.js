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
let activeUsers = new Map();

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("setup", (userData) => {
    if (!userData || !userData?._id) return;

    socket.join(userData._id);
    socket.userId = userData._id;

    // update the count in map
    const count = activeUsers.get(userData._id) || 0;
    activeUsers.set(userData._id, count + 1);

    // notify this socket it's connected
    socket.emit("connected");

    // broadcast updated active users to all connected clients
    io.emit("active users", [...activeUsers.keys()]);
  });

  socket.on("join chat", (room) => {
    console.log("user joined room: " + room);
    socket.join(room);
  });

  socket.on("typing", (payload) => {
    const room = payload?.room || payload;
    if (!room) return;
    socket.in(room).emit("typing", { room });
  });
  socket.on("stop typing", (payload) => {
    const room = payload?.room || payload;
    if (!room) return;
    socket.in(room).emit("stop typing", { room });
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // for mesage read event
  socket.on("messages read", ({ chatId }) => {
    if (!chatId) return;

    // broadcast to all users in the chat room that messages have been read
    socket.in(chatId).emit("messages read update", {
      chatId,
      userId: socket.userId,
    });
  });

  socket.on("disconnect", () => {
    if (socket?.userId) {
      const count = activeUsers.get(socket.userId);

      if (count <= 1) {
        activeUsers.delete(socket.userId);
      } else {
        activeUsers.set(socket.userId, count - 1);
      }
      io.emit("active users", [...activeUsers.keys()]);
    }

    // leave any rooms if needed
    if (socket.userId) socket.leave(socket.userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold);
});
