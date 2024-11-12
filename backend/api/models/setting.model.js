import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    logoImg: {
      type: String,
      default: null,
    },
    faviconImg: {
      type: String,
      default: null,
    },
    currency: {
      type: String,
      default: "",
    },
    primaryColor: {
      type: String,
      default: null,
    },
    secondaryColor: {
      type: String,
      default: null,
    },
    tertiaryColor: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
