require("dotenv").config();
const { env } = require("./config/env");
const { connectDb } = require("./config/db");
const { app } = require("./app");

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

connectDb()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`CivicTract API listening on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Could not start server:", error);
    process.exit(1);
  });
