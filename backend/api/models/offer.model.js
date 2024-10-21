import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    offer_type: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    flat_value: {
      type: Number,
      required: function () {
        return this.offer_type === "flat";
      },
    },
    percentage_value: {
      type: Number,
      required: function () {
        return this.offer_type === "percentage";
      },
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
