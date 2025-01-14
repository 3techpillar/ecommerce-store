import { Schema, model } from "mongoose";

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

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
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
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },
    appliedCoupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    couponDiscountAmount: {
      type: Number,
      default: 0,
    },
    totalPriceAfterDiscount: {
      type: Number,
      default: 0,
    },
    netPrice: {
      type: Number,
      default: 0,
    },
    billingAddress: {
      type: addressSubSchema,
    },
    shippingAddress: {
      type: addressSubSchema,
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    selectedShippingMethod: {
      shippingCode: {
        type: String,
        default: null,
      },
      shippingType: {
        type: String,
        enum: ["1-day", "2-day", "normal"],
        default: null,
      },
      shippingCharges: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema);

export default Cart;
