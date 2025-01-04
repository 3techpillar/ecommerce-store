import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

//admin
import authRoutes from "./api/routes/auth.route.js";
import categoryRoutes from "./api/routes/category.route.js";
import productRoutes from "./api/routes/product.route.js";
import settingRoutes from "./api/routes/setting.route.js";
import bannerRoutes from "./api/routes/banner.route.js";
import featuredProductRoutes from "./api/routes/featuredProduct.route.js";
import categoryProductRoutes from "./api/routes/categoryProduct.route.js";
import specialCategoryRotues from "./api/routes/category/specialCategory.route.js";
import couponRoutes from "./api/routes/coupon.route.js";

//user
import userRoutes from "./api/routes/user/user.route.js";
import addressRoutes from "./api/routes/user/address.route.js";
import cartRoutes from "./api/routes/cart.route.js";
import wishlistRoutes from "./api/routes/user/wishlist.route.js";

import orderRoutes from "./api/routes/order.route.js";

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

const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3002"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

//admin
app.use(`/${API_V}/auth`, authRoutes);
app.use(`/${API_V}/setting`, settingRoutes);
app.use(`/${API_V}/banner`, bannerRoutes);

app.use(`/${API_V}/category`, categoryRoutes);
app.use(`/${API_V}/special-category`, specialCategoryRotues);

app.use(`/${API_V}/product`, productRoutes);
app.use(`/${API_V}/featured`, featuredProductRoutes);
app.use(`/${API_V}/category-product`, categoryProductRoutes);
app.use(`/${API_V}/coupon`, couponRoutes);

//user
app.use(`/${API_V}/user`, userRoutes);
app.use(`/${API_V}/address`, addressRoutes);
app.use(`/${API_V}/cart`, cartRoutes);
app.use(`/${API_V}/wishlist`, wishlistRoutes);

app.use(`/${API_V}/order`, orderRoutes);

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
