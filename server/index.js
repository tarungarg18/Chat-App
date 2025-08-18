const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");
const socket = require("socket.io");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins (for both REST and WebSockets)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://chat-app-frontend-kag8.onrender.com",   // your frontend
  "https://admin-panel-67kf.onrender.com",         // your admin panel
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// DB Connection
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error("❌ MONGO_URL not set in environment variables!");
  process.exit(1);
}
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ DB Connection Successful"))
.catch((err) => console.error("❌ DB Connection Error:", err.message));

// Health check
app.get("/ping", (_req, res) => res.json({ msg: "Ping Successful" }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ status: false, msg: err.message || "Internal Server Error" });
});

// Server + Socket.io
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

const io = socket(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
app.set("io", io);

// Socket.io handlers
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
    socket.emit("msg-sent", { to: data.to, msg: data.msg });
  });

  socket.on("disconnect", () => {
    if (socket.userId) onlineUsers.delete(socket.userId);
  });
});
