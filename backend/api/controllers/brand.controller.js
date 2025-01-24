import Brand from "../models/brand.model.js";
import { errorHandler } from "../utils/error.js";

export const createBrand = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const { brandName } = req.body;

    if (!storeId) {
      return next(errorHandler(404, "Store Id is required"));
    }
    if (!brandName) {
      return next(errorHandler(404, "Brand name is required"));
    }

    const newBrand = new Brand({
      storeId,
      brandName,
    });

    const savedBrand = await newBrand.save();

    return res.status(200).json({ message: "Brand created", savedBrand });
  } catch (error) {
    console.log("POST_BRAND", error);
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const updateBrand = req.body;

    if (!brandId) {
      return next(errorHandler(404, "Brand Id is required to update brand"));
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      {
        $set: updateBrand,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBrand) {
      return errorHandler(404, "Brand not found");
    }

    return res.status(200).json({ message: "Brand updated", updatedBrand });
  } catch (error) {
    console.log("PUT_BRAND", error);
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;

    if (!brandId) {
      return next(errorHandler(404, "brand Id is required to delete brand"));
    }

    await Brand.findByIdAndDelete(brandId);

    res.status(200).json({ message: "Brand deleted" });
  } catch (error) {
    console.log("DELETE_BRAND", error);
    next(error);
  }
};

export const getAllBrand = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return next(errorHandler(404, "Store id is required."));
    }
    const brands = await Brand.find({ storeId });

    if (brands.length === 0) {
      return next(errorHandler(404, "You dont have any brand, Create one"));
    }

    return res.status(200).json({ message: "Brand fetched", brands });
  } catch (error) {
    console.log("GET_BRAND", error);
  }
};

export const getBrandById = async (req, res, next) => {
  try {
    const { brandId } = req.params;

    if (!brandId) {
      return next(errorHandler(404, "Brand id is required"));
    }

    const brand = await Brand.findById(brandId);

    if (brand.length === 0) {
      return next(errorHandler(404, "Brand not found"));
    }

    return res.status(200).json({ message: "Brand fetched", brand });
  } catch (error) {
    console.log("GET_BANNER_BY_ID", error);
    next(error);
  }
};
