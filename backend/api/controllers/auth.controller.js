import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(errorHandler(400, "Admin already exists"));
    }

    const username = email.split("@")[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "180d",
    });

    const { password: pass, ...user } = newAdmin._doc;

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 180 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
      .json({ message: "Signup successful", user, token });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validAdmin = await Admin.findOne({ email });

    if (!validAdmin) {
      return next(errorHandler(404, "Admin not found"));
    }

    const validPassword = bcrypt.compareSync(password, validAdmin.password);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "180d",
    });

    const { password: pass, ...user } = validAdmin._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 180 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
      .json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("Admin has been signed out");
  } catch (error) {
    next(error);
  }
};
