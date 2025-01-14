import mongoose, { Schema } from "mongoose";

const addressSubSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// Attribute schema for product
const attributeSchema = new Schema(
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

// Offer schema for price
const offerSchema = new Schema(
  {
    offer_type: {
      type: String,
      enum: ["flat", "percentage"],
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
    _id: false,
  }
);

// Price schema for product
const priceSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    offers: [offerSchema],
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
    _id: false,
  }
);

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
    attributes: {
      type: [attributeSchema],
      default: [],
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
    price_data: priceSchema,
  },
  {
    _id: false,
  }
);

const orderSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
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
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscountAmount: {
      type: Number,
      default: 0,
    },
    totalPriceAfterDiscount: {
      type: Number,
      required: true,
    },
    selectedShippingMethod: {
      shippingType: {
        type: String,
        required: true,
        enum: ["1-day", "2-day", "normal"],
      },
      shippingCode: {
        type: String,
        required: true,
      },
      shippingCharges: {
        type: Number,
        required: true,
      },
    },
    netPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: addressSubSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cashOnDelivery", "online"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    history: [
      {
        writtenBy: { type: String },
        orderStatusLog: { type: String },
        paymentStatusLog: { type: String },
        comment: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
