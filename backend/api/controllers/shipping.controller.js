import Shipping from "../models/shipping.model.js";
import { errorHandler } from "../utils/error.js";

export const createShipping = async (req, res, next) => {
  const { storeId } = req.params;
  const { type, charges, isActive } = req.body;

  if (!type) {
    return next(errorHandler(400, "Shipping type are required"));
  }

  try {
    const existingShipping = await Shipping.findOne({ type });

    if (existingShipping) {
      return next(errorHandler(400, "Shipping charges is already exists"));
    }

    const newShipping = new Shipping({
      storeId,
      type,
      charges,
      isActive,
    });

    await newShipping.save();

    return res.status(201).json({
      message: "Shipping charges created successfully",
      shipping: newShipping,
    });
  } catch (error) {
    next(error);
  }
};

export const updateShipping = async (req, res, next) => {
  const { shippingId } = req.params;
  const { type, charges, isActive } = req.body;

  try {
    const shipping = await Shipping.findById(shippingId);

    if (!shipping) {
      return next(errorHandler(404, "Shipping charges not found"));
    }

    const updatedShipping = await Shipping.findByIdAndUpdate(
      shippingId,
      {
        $set: {
          type: type || shipping.type,
          charges: charges || shipping.charges,
          isActive: isActive !== undefined ? isActive : shipping.isActive,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Shipping charges updated successfully",
      shipping: updateShipping,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteShipping = async (req, res, next) => {
  const { shippingId } = req.params;

  try {
    const shipping = await Shipping.findByIdAndDelete(shippingId);

    if (!shipping) {
      return next(errorHandler(404, "Shipping charges not found"));
    }

    return res
      .status(200)
      .json({ message: "Shipping charges deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllShipping = async (req, res, next) => {
  const { storeId } = req.params;
  try {
    const shipping = await Shipping.find({ storeId });

    if (!shipping) {
      return next(errorHandler(404, "shipping charges not found"));
    }

    return res
      .status(200)
      .json({ message: "Shipping charges fetched successfully", shipping });
  } catch (error) {
    next(error);
  }
};

export const getShipping = async (req, res, next) => {
  const { storeId } = req.params;
  try {
    const shipping = await Shipping.find({ storeId, isActive: true });

    if (!shipping) {
      return next(errorHandler(404, "shipping charges not found"));
    }

    return res
      .status(200)
      .json({ message: "Shipping charges fetched successfully", shipping });
  } catch (error) {
    next(error);
  }
};

export const getShippingById = async (req, res, next) => {
  const { shippingId } = req.params;

  try {
    const shipping = await Shipping.findById(shippingId);

    if (!shipping) {
      return next(errorHandler(404, "shipping charges not found"));
    }

    return res
      .status(200)
      .json({ message: "Shipping charges fetched successfully", shipping });
  } catch (error) {
    next(error);
  }
};
