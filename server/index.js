const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const adminRoutes = require("./routes/admin");
const path = require("path");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:3000",  // Main chat app
    "http://localhost:3001",  // Admin panel
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Session/Passport removed; simple auth only

app.use("/api/admin", adminRoutes);

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/chat-app";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);
const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

app.set("io", io);

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId; // Store userId in socket for admin operations
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
    // Also emit an ack back to sender so their UI updates reliably
    socket.emit("msg-sent", { to: data.to, msg: data.msg });
  });

  socket.on("disconnect", () => {
    // Remove user from online users when they disconnect
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
    }
  });
});
