import mongoose from "mongoose";

const productByCategory = new mongoose.Schema(
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    displayLimit: {
      type: Number,
      min: 1,
      max: 12,
      default: 4,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const CategoryProduct = mongoose.model("CategoryProduct", productByCategory);

export default CategoryProduct;
