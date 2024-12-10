import Order from "../models/order.modal.js";
import Cart from "../models/cart.modal.js";
import { errorHandler } from "../utils/error.js";

export const createOrder = async (req, res, next) => {
  try {
    const { userId, storeId } = req.params;

    const { paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId, isActive: true }).populate([
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

    if (!cart || cart.items.length === 0) {
      return next(errorHandler(404, "Cart is empty"));
    }

    if (!cart.shippingAddress) {
      return next(
        errorHandler(400, "Shipping address is required in the cart")
      );
    }

    const shippingAddress = {
      ...cart.shippingAddress,
    };

    const newOrder = new Order({
      storeId,
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        totalProductDiscount: item.totalProductDiscount || 0,
        totalPrice: item.price * item.quantity,
      })),
      totalPrice: cart.totalPrice,
      discount: cart.discount,
      couponCode: cart.appliedCoupon ? cart.appliedCoupon.code : null,
      couponDiscountAmount: cart.couponDiscountAmount
        ? cart.couponDiscountAmount
        : 0,
      totalPriceAfterDiscount: cart.totalPriceAfterDiscount,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    const savedOrder = await newOrder.save();

    await Cart.findOneAndUpdate(
      { user: userId, isActive: true },
      {
        isActive: false,
      }
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.log("POST_CREATE_ORDER");
    next(error);
  }
};

//admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, orderStatus, writtenBy, comment } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(errorHandler(404, "Order not found"));
    }

    let historyEntry = {
      writtenBy: writtenBy || "Admin",
      orderStatusLog: null,
      paymentStatusLog: null,
      comment: comment || "No additional comments",
      timestamp: new Date(),
    };

    if (paymentStatus) {
      if (!["pending", "paid", "failed"].includes(paymentStatus)) {
        return next(errorHandler(400, "Invalid payment status"));
      }

      order.paymentStatus = paymentStatus;
      historyEntry.paymentStatusLog = paymentStatus;
    }

    if (orderStatus) {
      if (
        !["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(
          orderStatus
        )
      ) {
        return next(errorHandler(400, "Invalid order status"));
      }
      order.orderStatus = orderStatus;
      historyEntry.orderStatusLog = orderStatus;
    }

    if (historyEntry.orderStatusLog || historyEntry.paymentStatusLog) {
      order.history = order.history || [];
      order.history.push(historyEntry);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "status updated successfully",
      order,
    });
  } catch (error) {
    console.log("POST_UPDATE_ORDER_STATUS");
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { userId, orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(errorHandler(404, "Order not found"));
    }

    if (order.user.toString() !== userId) {
      return next(errorHandler(403, "You are not allowed to cancel the order"));
    }

    if (order.orderStatus === "cancelled") {
      return next(errorHandler(400, "Order is already cancelled"));
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return next(errorHandler(400, "This order cannot be cancelled"));
    }

    order.orderStatus = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log("POST_CANCEL_ORDER");
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { status } = req.query;

    const filter = { storeId };

    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter).populate([
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
        path: "shippingAddress",
        select: "street city state country zipCode",
      },
    ]);

    if (!orders || orders.length === 0) {
      return next(errorHandler(404, "Orders not found"));
    }

    return res
      .status(201)
      .json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.log("GET_ALL_ORDERS");
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter).populate([
      {
        path: "user",
      },
      {
        path: "items.product",
        populate: {
          path: "price",
        },
      },
      {
        path: "shippingAddress",
        select: "street city state country zipCode",
      },
    ]);

    if (!orders || orders.length === 0) {
      return next(errorHandler(404, "Orders not found"));
    }

    return res
      .status(201)
      .json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.log("GET_USER_ORDERS");
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate([
      {
        path: "user",
      },
      {
        path: "items.product",
        populate: {
          path: "price",
        },
      },
      {
        path: "shippingAddress",
        select: "street city state country zipCode",
      },
    ]);

    if (!order) {
      return next(errorHandler(404, "Order not found"));
    }

    return res
      .status(200)
      .json({ message: "Orders fetched successfully", order });
  } catch (error) {
    console.log("GET_ORDER_BY_ID");
    next(error);
  }
};
