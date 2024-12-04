import Address from "../../models/user/address.modal.js";
import { errorHandler } from "../../utils/error.js";

export const addAddress = async (req, res, next) => {
  const { userId } = req.user;
  const { street, city, state, country, zipCode, isDefault } = req.body;

  if (!street || !city || !state || !country || !zipCode) {
    return next(errorHandler(400, "All address fields are required"));
  }

  try {
    if (isDefault) {
      await Address.updateMany(
        { user: userId },
        { $set: { isDefault: false } }
      );
    }

    const address = new Address({
      user: userId,
      street,
      city,
      state,
      country,
      zipCode,
      isDefault: !!isDefault,
    });

    await address.save();

    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    next(error);
  }
};

export const getAddress = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const addresses = await Address.find({ user: userId });

    if (!addresses.length) {
      return res.status(404).json({ message: "No addresses found" });
    }

    res.status(200).json({ addresses });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  const { userId } = req.user;
  const { addressId } = req.params;
  const { street, city, state, country, zipCode, isDefault } = req.body;

  try {
    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      return next(errorHandler(404, "Address not found"));
    }

    if (isDefault) {
      await Address.updateMany(
        { user: userId },
        { $set: { isDefault: false } }
      );
    }

    Object.assign(address, {
      street,
      city,
      state,
      country,
      zipCode,
      isDefault: !!isDefault,
    });

    await address.save();

    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  const { userId } = req.user;
  const { addressId } = req.params;

  try {
    const address = await Address.findOneAndDelete({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return next(errorHandler(404, "Address not found"));
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};
