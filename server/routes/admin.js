const router = require("express").Router();
const User = require("../models/userModel");
const Message = require("../models/messageModel");

// Test endpoint to verify admin routes are accessible
router.get("/", (req, res) => {
  res.json({ message: "Admin routes are working!", status: "success" });
});

// GET /api/admin/users - Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/delete-all-users - Delete all users
router.delete("/delete-all-users", async (req, res) => {
  try {
    const result = await User.deleteMany({});

    const io = req.app.get("io"); 
    if (io) {
      global.onlineUsers.forEach((socketId, userId) => {
        io.to(socketId).emit("forceLogout", { 
          reason: "All users deleted by admin",
          userId: userId 
        });
      });
      global.onlineUsers.clear();
      io.emit("usersDeleted", { scope: "all" });
    }

    res.json({ msg: "All users deleted", count: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/delete-user/:userId - Delete specific user
router.delete("/delete-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Message.deleteMany({ 
      $or: [
        { from: userId },
        { to: userId }
      ]
    });

    const result = await User.findByIdAndDelete(userId);

    const io = req.app.get("io");
    if (io) {
      const socketId = global.onlineUsers.get(userId);
      if (socketId) {
        io.to(socketId).emit("forceLogout", { 
          reason: "Account deleted by admin",
          userId: userId 
        });
        global.onlineUsers.delete(userId);
      }
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

// DELETE /api/admin/delete-all-messages - Delete all messages
router.delete("/delete-all-messages", async (req, res) => {
  try {
    const result = await Message.deleteMany({});
    const io = req.app.get("io");
    if (io) {
      io.emit("messagesCleared", { reason: "Admin cleared all messages" });
    }
    res.json({ msg: "All messages deleted", count: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
