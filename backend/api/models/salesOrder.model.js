import mongoose, { Schema } from "mongoose";

// Product schema for order items
const orderProductSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["simple", "variable"],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    brand: {
      type: String,
      default: "General",
    },
    category: {
      name: { type: String },
      slug: { type: String },
    },
    rating: {
      type: Number,
      required: true,
    },
    numReviews: {
      type: Number,
      required: true,
    },
    price_data: {
      price: {
        type: Number,
        required: true,
      },
      total_discount: {
        type: Number,
        required: true,
      },
      discounted_price: {
        type: Number,
        required: true,
      },
    },
  },
  {
    _id: false,
  }
);

const salesOrderSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product: {
      type: orderProductSchema,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalProductDiscount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);

export default SalesOrder;
