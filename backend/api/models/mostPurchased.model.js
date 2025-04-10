import mongoose from "mongoose";

const MostPurchasedProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Store",
    },
    purchaseCount: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const MostPurchasedProduct = mongoose.model(
  "MostPurchasedProduct",
  MostPurchasedProductSchema
);

export default MostPurchasedProduct;
