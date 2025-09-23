import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import User from "../../models/user/user.modal.js";
import OTP from "../../models/otp.model.js";
import { generateOTP } from "../../utils/generateOTP.js";
import sendEmail from "../../utils/sendEmail.js";
 
import {
  googleClientId,
  googleClientSecret,
  googleRedirectUrl,
} from "../../utils/constant.js";
import axios from "axios";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
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
      .cookie("token", token, {
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
      .cookie("token", token, {
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

export const googleLogin = async (req, res, next) => {
  try {
    const code = req.query.code;

    const { data: tokenData } = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUrl,
        grant_type: "authorization_code",
      }
    );
    const accessToken = tokenData.access_token;

    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!googleUser.email) {return next(errorHandler(400, "Google login failed"));}

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: null,
      });
    }

     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 180 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      }).redirect(`http://localhost:3002`);


  } catch (error) {
    console.error("Google error:", error.response?.data || error.message);

    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("token").status(200).json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(errorHandler(400, "Email is required"));

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const otp = generateOTP();

    const saveOTP = new OTP({
      userId: validUser._id,
      otp,
      expiry: new Date(Date.now() + 10 * 60 * 1000),
    });
    await saveOTP.save();

    // ✅ Enable in production
    // await sendEmail(
    //   validUser.email,
    //   "Password Reset OTP",
    //   `Your OTP is: ${otp}\nIt is valid for 10 minutes.`
    // );

    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    next(error);
  }
};

// ----------------- Verify OTP -----------------
export const verifyOtp = async (req, res, next) => {
  const { email, otp, password } = req.body;
  console.log(email, otp, password)


  if (!email || !otp || !password) {
    return next(errorHandler(400, "Email, OTP and new password are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));


    const otpDoc = await OTP.findOne({
      userId: validUser._id,
    });

    if (!otpDoc) return next(errorHandler(400, "Invalid or expired OTP"));

    const hashedPassword = await bcrypt.hash(password, 10);
    validUser.password = hashedPassword;
    await validUser.save();

    await OTP.deleteMany({ userId: validUser._id });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// ----------------- Reset Password -----------------
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return next(errorHandler(400, "Email, OTP and newPassword are required"));

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const otpDoc = await OTP.findOne({
      userId: validUser._id,
      otp,
      expiry: { $lt: Date.now() },
    });

    if (!otpDoc) return next(errorHandler(400, "Invalid or expired OTP"));

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    validUser.password = hashedPassword;
    await validUser.save();

    await OTP.deleteMany({ userId: validUser._id });

    res.status(200).json({ message: "Password reset successful" });
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

    const validUser = await User.findById(id).select("-password");

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: validUser,
    });
  } catch (error) {
    console.error("GET_USER_BY_ID_ERROR:", error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.user;

    const validUser = await User.findById(id).select("-password");

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: validUser,
    });
  } catch (error) {
    console.error("GET_USER_BY_ID_ERROR:", error);
    next(error);
  }
};
