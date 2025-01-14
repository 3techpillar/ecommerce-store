import { Schema, model } from "mongoose";

const shippingSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    code: {
      type: String,
    },
    type: {
      type: String,
      enum: ["1-day", "2-day", "normal"],
      required: true,
      default: "normal",
    },
    charges: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Shipping = model("Shipping", shippingSchema);

export default Shipping;
