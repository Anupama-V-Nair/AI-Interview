// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Error:", error.message);

    // DON'T crash entire app immediately
    // process.exit(1);
  }
};

module.exports = connectDB;