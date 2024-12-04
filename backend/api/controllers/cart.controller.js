import Cart from "../models/cart.modal.js";
import Coupon from "../models/coupon.model.js";
import Product from "../models/product/product.model.js";
import { errorHandler } from "../utils/error.js";

const populateCart = async (cartId) => {
  return Cart.findById(cartId).populate([
    {
      path: "items.product",
      populate: {
        path: "price",
      },
    },
    {
      path: "appliedCoupon",
      select: "code discount discountType minPrice expires isActive",
    },
  ]);
};

export const addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return next(errorHandler(400, "Invalid input data"));
    }

    const product = await Product.findById(productId).populate({
      path: "price",
      populate: {
        path: "offers",
      },
    });

    if (!product) {
      return next(errorHandler(404, "Product not found"));
    }

    if (!product.price) {
      return next(
        errorHandler(404, "Price details not found for this product")
      );
    }

    const { price = 0, discounted_price = price } = product.price;

    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "price",
      },
    });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalPrice: 0,
        discount: 0,
        totalPriceAfterDiscount: 0,
        netPrice: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (existingItemIndex > -1) {
      const updatedQuantity = cart.items[existingItemIndex].quantity + quantity;

      cart.items[existingItemIndex] = {
        ...cart.items[existingItemIndex],
        quantity: updatedQuantity,
        price: discounted_price,
        totalProductDiscount: (price - discounted_price) * updatedQuantity,
      };
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: discounted_price,
        totalProductDiscount: (price - discounted_price) * quantity,
      });
    }

    const totals = cart.items.reduce(
      (acc, item) => ({
        totalPrice: acc.totalPrice + item.price * item.quantity,
        totalDiscount: acc.totalDiscount + item.totalProductDiscount,
      }),
      { totalPrice: 0, totalDiscount: 0 }
    );

    cart.totalPrice = totals.totalPrice;
    cart.discount = totals.totalDiscount;
    cart.totalPriceAfterDiscount = cart.totalPrice - cart.discount;
    cart.netPrice = cart.totalPriceAfterDiscount;

    await cart.save();

    return res.status(201).json({
      success: true,
      cart: await populateCart(cart._id),
    });
  } catch (error) {
    console.error("POST_ADDTOCART_ERROR", error);
    next(error);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { userId, couponCode } = req.body;

    if (!userId || !couponCode) {
      return next(errorHandler(400, "User ID and coupon code are required"));
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(errorHandler(404, "Cart not found"));
    }

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return next(errorHandler(400, "Invalid coupon code"));
    }

    if (!coupon.isActive) {
      return next(errorHandler(400, "This coupon is no longer active"));
    }

    if (coupon.expires < new Date()) {
      return next(errorHandler(400, "This coupon has expired"));
    }

    if (cart.totalPriceAfterDiscount < coupon.minPrice) {
      return next(
        errorHandler(
          400,
          `This coupon required a minimum purchase of ${coupon.minPrice}`
        )
      );
    }

    let couponDiscountAmount = 0;
    if (coupon.discountType === "percentage") {
      couponDiscountAmount = Math.round(
        (cart.totalPriceAfterDiscount * coupon.discount) / 100
      );
    } else if (coupon.discountType === "flat") {
      couponDiscountAmount = coupon.discount;
    }

    cart.appliedCoupon = coupon._id;
    cart.couponDiscountAmount = couponDiscountAmount;
    cart.netPrice = cart.totalPrice - cart.discount - couponDiscountAmount;

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Coupon applied successfully",
      cart: await populateCart(cart._id),
    });
  } catch (error) {
    console.error("POST_APPLYCOUPON_ERROR", error);
    next(error);
  }
};

export const removeCoupon = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(errorHandler(404, "Cart not found"));
    }

    cart.appliedCoupon = null;
    cart.couponDiscountAmount = 0;
    cart.totalPriceAfterDiscount = cart.totalPrice - cart.discount;
    cart.netPrice = cart.totalPriceAfterDiscount;

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Coupon removed successfully",
      cart: await populateCart(cart._id),
    });
  } catch (error) {
    console.error("POST_REMOVECOUPON_ERROR", error);
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return next(
        errorHandler(400, "Missing required parameters: userId or productId")
      );
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "price",
        select: "price discounted_price total_discount",
      },
    });

    if (!cart) {
      return next(errorHandler(404, "Cart not found"));
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (productIndex === -1) {
      return next(errorHandler(404, "Product not found in cart"));
    }

    cart.items.splice(productIndex, 1);

    if (cart.items.length > 0) {
      const totals = cart.items.reduce(
        (acc, item) => {
          const itemPrice =
            item.product.price.discounted_price || item.product.price.price;
          const originalPrice = item.product.price.price;
          const itemDiscount = (originalPrice - itemPrice) * item.quantity;

          return {
            totalPrice: acc.totalPrice + itemPrice * item.quantity,
            totalDiscount: acc.totalDiscount + itemDiscount,
          };
        },
        { totalPrice: 0, totalDiscount: 0 }
      );

      cart.totalPrice = totals.totalPrice;
      cart.discount = totals.totalDiscount;

      if (cart.appliedCoupon) {
        const coupon = await Coupon.findById(cart.appliedCoupon);

        if (
          !coupon ||
          !coupon.isActive ||
          coupon.expires < new Date() ||
          cart.totalPrice - cart.discount < coupon.minPrice
        ) {
          cart.appliedCoupon = null;
          cart.couponDiscountAmount = 0;
        } else {
          const couponDiscountAmount =
            coupon.discountType === "percentage"
              ? (cart.totalPriceAfterDiscount * coupon.discount) / 100
              : coupon.discount;

          cart.couponDiscountAmount = Math.min(
            couponDiscountAmount,
            cart.totalPrice - cart.discount
          );
        }
      } else {
        cart.couponDiscountAmount = 0;
      }

      cart.totalPriceAfterDiscount =
        cart.totalPrice - cart.discount - cart.couponDiscountAmount;
      cart.netPrice = cart.totalPriceAfterDiscount;
    } else {
      cart.totalPrice = 0;
      cart.discount = 0;
      cart.couponDiscountAmount = 0;
      cart.totalPriceAfterDiscount = 0;
      cart.netPrice = 0;
      cart.appliedCoupon = null;
    }

    await cart.save();

    const updatedCart = await populateCart(cart._id);

    return res.status(201).json({
      success: true,
      message: "Product removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("POST_REMOVEFROMCART", error);
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "price",
        select: "price discounted_price total_discount",
      },
    });

    if (!cart) {
      return next(errorHandler(404, "Cart not found"));
    }

    return res.status(201).json({
      success: true,
      message: "Cart fetched successfully",
      cart: await populateCart(cart._id),
    });
  } catch (error) {
    console.error("GET_GETCART", error);
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(errorHandler(404, "Cart not found"));
    }

    cart.items = [];
    cart.totalPrice = 0;
    cart.discount = 0;
    cart.appliedCoupon = null;
    cart.couponDiscountAmount = 0;
    cart.netPrice = 0;
    cart.totalPriceAfterDiscount = 0;

    await cart.save();

    res.status(201).json({ success: true, message: "Your cart is cleared" });
  } catch (error) {
    console.error("DELETE_CLEARCART", error);
    next(error);
  }
};
