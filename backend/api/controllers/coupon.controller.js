import Coupon from "../models/coupon.model.js";
import { errorHandler } from "../utils/error.js";

export const createCoupon = async (req, res, next) => {
  const { storeId } = req.params;
  const {
    code,
    expires,
    discountType,
    discount,
    minPrice,
    maxPrice,
    isActive,
  } = req.body;

  if (!code || !expires || !discountType || !discount) {
    return next(
      errorHandler(
        400,
        "Code, expiration date, discount type, and discount are required"
      )
    );
  }

  // if (discountType === "percentage" && maxPrice === undefined) {
  //   return next(
  //     errorHandler(
  //       400,
  //       "maxPrice is required when discountType is 'percentage'"
  //     )
  //   );
  // }

  try {
    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      return next(errorHandler(400, "Coupon with this code already exists"));
    }

    const newCoupon = new Coupon({
      storeId,
      code,
      expires,
      discountType,
      discount,
      minPrice,
      maxPrice,
      isActive,
    });

    await newCoupon.save();

    return res
      .status(201)
      .json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const {
    code,
    expires,
    discountType,
    discount,
    minPrice,
    maxPrice,
    isActive,
  } = req.body;

  try {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return next(errorHandler(404, "Coupon not found"));
    }

    // if (discountType === "percentage" && maxPrice === undefined) {
    //   return next(
    //     errorHandler(
    //       400,
    //       "maxPrice is required when discountType is 'percentage'"
    //     )
    //   );
    // }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        $set: {
          code: code || coupon.code,
          expires: expires || coupon.expires,
          discountType: discountType || coupon.discountType,
          discount: discount || coupon.discount,
          minPrice: minPrice || coupon.minPrice,
          maxPrice: maxPrice || coupon.maxPrice,
          isActive: isActive !== undefined ? isActive : coupon.isActive,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json({ message: "Coupon updated successfully", coupon: updatedCoupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  const { couponId } = req.params;

  try {
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return next(errorHandler(404, "Coupon not found"));
    }

    return res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllCoupon = async (req, res, next) => {
  const { storeId } = req.params;
  try {
    const coupons = await Coupon.find({ storeId });

    if (!coupons) {
      return next(errorHandler(404, "Coupon not found"));
    }

    return res
      .status(200)
      .json({ message: "Coupons fetched successfully", coupons });
  } catch (error) {
    next(error);
  }
};

export const getCoupon = async (req, res, next) => {
  const { couponId } = req.params;

  try {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return next(errorHandler(404, "Coupon not found"));
    }

    return res
      .status(200)
      .json({ message: "Coupon fetched successfully", coupon });
  } catch (error) {
    next(error);
  }
};
