import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import User from "../../models/user/user.modal.js";

export const signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const { password: pass, ...user } = newUser._doc;

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
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const { password: pass, ...user } = validUser._doc;

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

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("[USER_UPDATE_ERROR]: ", error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const validUser = await User.findById(id);

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({ data: validUser });
  } catch (error) {
    next(error);
  }
};
