import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    offers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
    ],
    total_discount: {
      type: Number,
      required: true,
    },
    discounted_price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Price = mongoose.model("Price", priceSchema);

export default Price;
