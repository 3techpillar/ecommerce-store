import mongoose from "mongoose";

const mostVisitedProductSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    visitCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const MostVisitedProduct = mongoose.model(
  "MostVisitedProduct",
  mostVisitedProductSchema
);

export default MostVisitedProduct;
