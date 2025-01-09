import Cart from "../models/cart.modal.js";
import Coupon from "../models/coupon.model.js";
import Product from "../models/product/product.model.js";
import Address from "../models/user/address.modal.js";
import { errorHandler } from "../utils/error.js";

const populateCart = async (cartId) => {
  return Cart.findById(cartId).populate([
    {
      path: "user",
      select: "name email addresses phone",
    },
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
    {
      path: "shippingAddress",
      select: "street city state country zipCode",
    },
  ]);
};

export const addToCart = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { userId, productId, quantity } = req.body;

    // Validate input data
    if (!userId || !productId || !quantity) {
      return next(errorHandler(400, "Invalid input data"));
    }

    // Find product details
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

    const { price: originalPrice = 0, discounted_price = originalPrice } =
      product.price;

    // Check if the user has an active cart
    let cart = await Cart.findOne({ user: userId, isActive: true });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        user: userId,
        storeId,
        items: [],
        totalPrice: 0,
        discount: 0,
        totalPriceAfterDiscount: 0,
        netPrice: 0,
        isActive: true,
      });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity and details of existing item
      const updatedQuantity = cart.items[existingItemIndex].quantity + quantity;

      cart.items[existingItemIndex] = {
        product: productId,
        quantity: updatedQuantity,
        price: discounted_price,
        totalProductDiscount:
          (originalPrice - discounted_price) * updatedQuantity,
        totalPrice: discounted_price * updatedQuantity,
      };
    } else {
      // Add new item to the cart
      cart.items.push({
        product: productId,
        quantity,
        price: discounted_price,
        totalProductDiscount: (originalPrice - discounted_price) * quantity,
        totalPrice: discounted_price * quantity,
      });
    }

    // Recalculate cart totals
    const totals = cart.items.reduce(
      (acc, item) => ({
        totalPrice: acc.totalPrice + item.totalPrice,
        totalDiscount: acc.totalDiscount + item.totalProductDiscount,
      }),
      { totalPrice: 0, totalDiscount: 0 }
    );

    cart.totalPrice = totals.totalPrice;
    cart.discount = totals.totalDiscount;
    cart.totalPriceAfterDiscount = cart.totalPrice;
    cart.netPrice = cart.totalPrice;

    // Apply coupon discount if a coupon is already applied
    if (cart.appliedCoupon && cart.couponDiscountAmount) {
      cart.netPrice = Math.max(0, cart.totalPrice - cart.couponDiscountAmount);
    }

    // Save the cart
    await cart.save();

    // Populate the cart for response
    const populatedCart = await populateCart(cart._id);

    return res.status(201).json({
      success: true,
      cart: populatedCart,
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

    const cart = await Cart.findOne({ user: userId, isActive: true });
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

    const cart = await Cart.findOne({ user: userId, isActive: true });
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

    const cart = await Cart.findOne({ user: userId, isActive: true }).populate({
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

    const cart = await Cart.findOne({ user: userId, isActive: true }).populate({
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
    const cart = await Cart.findOne({ user: userId, isActive: true });

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

export const updateCartShippingAddress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { addressId, shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: userId, isActive: true });
    if (!cart) {
      return next(errorHandler(404, "Cart not found"));
    }

    let savedAddress;

    if (addressId) {
      savedAddress = await Address.findOne({ _id: addressId, user: userId });
      if (!savedAddress) {
        return next(errorHandler(404, "Billing address not found"));
      }
    } else if (shippingAddress) {
      const newAddress = new Address({
        ...shippingAddress,
        user: userId,
      });
      savedAddress = await newAddress.save();
    } else {
      return next(errorHandler(400, "Shipping address is required"));
    }

    cart.shippingAddress = savedAddress._id;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Shipping address updated in the cart",
      cart: await populateCart(cart._id),
    });
  } catch (error) {
    console.log("UPDATE_CART_SHIPPING_ADDRESS_ERROR", error);
    next(error);
  }
};

export const getallCart = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const carts = await Cart.find({ storeId, isActive: true }).populate([
      {
        path: "user",
        select: "name email addresses phone",
      },
      {
        path: "items.product",
        populate: {
          path: "price",
          select: "price discounted_price total_discount",
        },
      },
      {
        path: "appliedCoupon",
        select: "code discount discountType minPrice expires isActive",
      },
      {
        path: "shippingAddress",
        select: "street city state country zipCode",
      },
    ]);

    const filteredCarts = carts.filter(
      (cart) => cart.items && cart.items.length > 0
    );

    if (!filteredCarts || filteredCarts.length === 0) {
      return next(errorHandler(404, "No carts with item found"));
    }

    return res.status(200).json({
      success: true,
      message: "Carts fetched successfully",
      filteredCarts,
    });
  } catch (error) {
    console.error("GET_GET_ALL_CART", error);
    next(error);
  }
};
