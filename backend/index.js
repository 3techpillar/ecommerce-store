import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./api/routes/auth.route.js";
import categoryRoutes from "./api/routes/category.route.js";

import { API_V } from "./api/utils/constant.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

app.use(`/${API_V}/auth`, authRoutes);
app.use(`/${API_V}/category`, categoryRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
