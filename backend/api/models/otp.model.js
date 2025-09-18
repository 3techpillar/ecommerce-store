import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    default: Date.now(),
  },
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
