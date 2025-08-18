const User = require("../models/userModel");
const bcrypt = require("bcrypt");
// OTP and Google auth removed; keeping simple local auth only

// Email OTP removed

// Login user
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    // Commented out Google OAuth check for now
    /*
    // Check if user is a Google OAuth user (no password required)
    if (user.authMethod === 'google') {
      return res.json({ msg: "This account was created with Google. Please use Google login.", status: false });
    }
    */

    // For local users, verify password
    if (!user.password) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    // Commented out email verification check for now
    /*
    // Check if email is verified for local users
    if (user.authMethod === 'local' && !user.isEmailVerified) {
      return res.json({ msg: "Please verify your email before logging in", status: false });
    }
    */

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// Register user
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword
    });

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// Get all users except current
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

// Set avatar
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

// Logout
module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

// Delete account
module.exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ msg: "User ID is required" });

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({ msg: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};
