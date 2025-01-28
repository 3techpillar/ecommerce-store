import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    minPrice: {
      type: Number,
      min: 0,
    },
    maxPrice: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Coupon = model("Coupon", couponSchema);

export default Coupon;
