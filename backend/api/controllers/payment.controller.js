import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.modal.js";
import Payment from "../models/payment.model.js";
import { errorHandler } from "../utils/error.js";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// cash on Delivery Payment
export const createCODPayment = async (req, res, next) => {
  try {
    const { orderId, userId, storeId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return next(errorHandler(404, "Order not found"));

    const payment = await Payment.create({
      orderId,
      userId,
      storeId,
      amount,
      method: "cashOnDelivery",
      status: "PENDING",
    });

    order.paymentStatus = "pending";
    await order.save();

    return res.status(201).json({
      success: true,
      message: "COD payment info created",
      payment,
    });
  } catch (err) {
    next(err);
  }
};

export const createOnlinePayment = async (req, res, next) => {
  try {
    const { orderId, userId, storeId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return next(errorHandler(404, "Order not found"));

      const amount = order.netPrice || order.totalPriceAfterDiscount || order.totalPrice;
    if (!amount) return next(errorHandler(400, "Invalid order amount"));

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${orderId}`,
      notes: { orderId },
    };

    const razorOrder = await razorpay.orders.create(options);

    const payment = await Payment.create({
      orderId,
      userId,
      storeId,
      amount,
      method: "online",
      status: "PENDING",
      razorpay_order_id: razorOrder.id,
    });

    order.paymentStatus = "pending";
    await order.save();

    return res.status(201).json({
      success: true,
      message: "Razorpay order created",
      razorOrder,
      payment,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyOnlinePayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId, razorpay_order_id },
        { status: "FAILED", razorpay_payment_id, razorpay_signature }
      );

      await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed" });

      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    await Payment.findOneAndUpdate(
      { orderId, razorpay_order_id },
      {
        status: "SUCCESS",
        razorpay_payment_id,
        razorpay_signature,
      }
    );

    await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid", orderStatus: "confirmed" });

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    next(err);
  }
};
