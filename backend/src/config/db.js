const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDb() {
  mongoose.set("strictQuery", true);
  let attempt = 0;
  const maxAttempts = 8;

  while (attempt < maxAttempts) {
    try {
      await mongoose.connect(env.mongodbUri);
      console.log("MongoDB connected");
      return;
    } catch (error) {
      attempt += 1;
      const delay = Math.min(1000 * 2 ** attempt, 15000);
      console.error(`MongoDB connection failed (attempt ${attempt}/${maxAttempts}): ${error.message}`);
      if (attempt >= maxAttempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

module.exports = { connectDb };
