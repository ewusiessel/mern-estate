import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("🚀 Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("🚧 ❌ Failed to connect to MongoDB!", err);
  });

const app = express();

// creating api route

app.use(express.json());

app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000!");
});

// creating api route

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);


// error handling middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
