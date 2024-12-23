import mongoose from "mongoose";

const featuredSectionSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    displayLimit: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      default: 4,
    },
    selectedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const FeaturedSection = mongoose.model(
  "FeaturedSection",
  featuredSectionSchema
);

export default FeaturedSection;
