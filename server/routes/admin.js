const router = require("express").Router();

// Simple admin protection using a shared key header
function verifyAdminKey(req, res, next) {
  // Fallback to a development key if ADMIN_KEY is not set to avoid 500s during local setup
  const configuredKey = process.env.ADMIN_KEY || "dev-admin-key";
  const providedKey = req.header("x-admin-key");
  if (!providedKey || providedKey !== configuredKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Protect all admin routes
router.use(verifyAdminKey);
const User = require("../models/userModel");
const Message = require("../models/messageModel");

// Delete all users
router.delete("/delete-all-users", async (req, res) => {
  try {
    const result = await User.deleteMany({});

    // 🚨 Force logout all connected clients using socket.io
    const io = req.app.get("io"); // get socket instance from index.js
    if (io) {
      // Force logout all online users
      global.onlineUsers.forEach((socketId, userId) => {
        io.to(socketId).emit("forceLogout", { 
          reason: "All users deleted by admin",
          userId: userId 
        });
      });
      // Clear the online users map
      global.onlineUsers.clear();
      // Notify any dashboards/clients to refresh user lists
      io.emit("usersDeleted", { scope: "all" });
    }

    res.json({ msg: "All users deleted", count: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete individual user
router.delete("/delete-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user before deletion to get their socket ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user's messages first
    await Message.deleteMany({ 
      $or: [
        { from: userId },
        { to: userId }
      ]
    });

    // Delete the user
    const result = await User.findByIdAndDelete(userId);

    // 🚨 Force logout the specific user using socket.io
    const io = req.app.get("io");
    if (io) {
      // Get the socket ID from onlineUsers map
      const socketId = global.onlineUsers.get(userId);
      if (socketId) {
        // Emit force logout to the specific socket
        io.to(socketId).emit("forceLogout", { 
          reason: "Account deleted by admin",
          userId: userId 
        });
        // Remove from online users
        global.onlineUsers.delete(userId);
      }
      // Broadcast to all clients so they can refresh contacts
      io.emit("userDeleted", { userId });
    }

    res.json({ 
      msg: "User deleted successfully", 
      deletedUser: { 
        id: result._id, 
        username: result.username, 
        email: result.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all messages
router.delete("/delete-all-messages", async (req, res) => {
  try {
    const result = await Message.deleteMany({});
    // Broadcast to all clients so they can refresh UI
    const io = req.app.get("io");
    if (io) {
      io.emit("messagesCleared", { reason: "Admin cleared all messages" });
    }
    res.json({ msg: "All messages deleted", count: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get("/users", async (_req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
