import Setting from "../../models/setting.model.js";
import { errorHandler } from "../../utils/error.js";

export const createSetting = async (req, res, next) => {
  try {
    const { userId, name } = req.body;

    if (!userId) {
      return next(errorHandler(400, "Unauthorized"));
    }

    if (!name) {
      return next(errorHandler(400, "Name is required"));
    }

    const newSetting = new Setting({
      name,
      userId,
    });

    await newSetting.save();

    return res.status(200).json(newSetting);
  } catch (error) {
    console.log("[SETTING_POST]: ", error);
    next(error);
  }
};

export const getFirstStore = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const store = await Setting.findOne({ userId }).sort({ createdAt: -1 });

    if (!store) {
      return res.status(404).json({ message: "No store found" });
    }

    res.status(200).json(store);
  } catch (error) {
    console.log("[SETTING_GET]: ", error);
    next(error);
  }
};

export const getAllStore = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const stores = await Setting.find({ userId });

    if (stores.length === 0) {
      return res.status(404).json({ message: "No stores found for this user" });
    }

    res.status(200).json(stores);
  } catch (error) {
    console.log("[SETTING_GET]: ", error);
    next(error);
  }
};

export const getStoreByUserId = async (req, res, next) => {
  try {
    const { userId, storeId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required" });
    }

    const store = await Setting.findOne({ userId, _id: storeId });

    if (store.length === 0) {
      return res.status(404).json({ message: "No stores found" });
    }

    res.status(200).json(store);
  } catch (error) {
    console.log("[SETTING_GET]: ", error);
    next(error);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const updateData = req.body;

    const updatedStore = await Setting.findByIdAndUpdate(
      storeId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json(updatedStore);
  } catch (error) {
    console.log("[SETTING_UPDATE]: ", error);
    next(error);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const deletedStore = await Setting.findByIdAndDelete(storeId);

    if (!deletedStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    console.log("[SETTING_DELETE]: ", error);
    next(error);
  }
};
