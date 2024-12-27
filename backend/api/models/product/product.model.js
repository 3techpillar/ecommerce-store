import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      default: "simple",
      enum: ["simple", "variable"],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    attributes: {
      type: [attributeSchema],
      default: [],
    },
    brand: {
      type: String,
      default: "General",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Price",
      required: true,
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
    seo: {
      title: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
      keywords: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
