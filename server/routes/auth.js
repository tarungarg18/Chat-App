const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  deleteAccount,
} = require("../controllers/userController");
// Simple auth only; Google OAuth removed

const router = require("express").Router();

// Local authentication routes
router.post("/login", login);
router.post("/register", register);

// OTP and Google routes removed

// Auth/user routes
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.delete("/delete/:id", deleteAccount);

module.exports = router;
