import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const offerSchema = mongoose.Schema(
  {
    offer_type: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    flat_value: { type: Number, required: true },
    discount_type: { type: Offer, required: true },
  },
  {
    timestamps: true,
  }
);
const priceSchema = mongoose.Schema(
  {
    price: { type: Number, required: true },
    discount_type: { type: [offerSchema], required: true },
    total_discount: { type: Number, required: true },
    discounted_price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product_id: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      default: "simple",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    attributes: {
      type: [String],
    },
    brand: {
      type: String,
      default: "General",
    },
    category: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: [priceSchema],
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    is_instock: {
      type: Boolean,
      default: true,
    },
    is_manage_stock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
