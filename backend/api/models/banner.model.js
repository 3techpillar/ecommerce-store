import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      default: null,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: {
          type: String,
        },
      },
      {
        _id: false,
      },
    ],
    buttonText: {
      type: String,
      default: "Learn More",
    },
    buttonLink: {
      type: String,
      default: null,
    },
    bannerPosition: {
      type: String,
      enum: ["hero", "second", "third"],
      default: "hero",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    pageType: {
      type: String,
      enum: ["home", "pdp", "plp", "cart"],
      default: "home",
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
