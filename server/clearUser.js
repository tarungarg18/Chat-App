require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel"); // adjust path if different

async function deleteAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const result = await User.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error deleting users:", err);
  }
}

deleteAllUsers();
