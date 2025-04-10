import SpecialCategory from "../../models/categories/specialCategory.model.js";
import { errorHandler } from "../../utils/error.js";

export const createSpecialCategory = async (req, res, next) => {
  if (!req.admin) {
    return next(
      errorHandler(403, "You are not allowed to create a special category")
    );
  }

  try {
    const { title, subTitle, selectedProducts, isActive } = req.body;

    if (!title) {
      return next(errorHandler(404, "Title is required"));
    }

    const { storeId } = req.params;

    const newCategory = await SpecialCategory.create({
      storeId,
      title,
      subTitle,
      selectedProducts,
      isActive,
    });

    res.status(201).json({
      message: "special category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.log("POST_SPECIAL_CATEGORY", error);
    next(error);
  }
};

export const updateSpecialCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCategory = await SpecialCategory.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return next(errorHandler(404, "Special category not found"));
    }

    res.status(200).json({
      message: "Special category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.log("PUT_SPECIAL_CATEGORY", error);
    next(error);
  }
};

export const deleteSpecialCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteCategory = await SpecialCategory.findByIdAndDelete(id);

    if (!deleteCategory) {
      return next(errorHandler(404, "Special category not found"));
    }

    res.status(200).json({
      message: "Special category deleted successfully",
    });
  } catch (error) {
    console.log("DELETE_SPECIAL_CATEGORY", error);
    next(error);
  }
};

export const getAllSpecialCategory = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const specialCategories = await SpecialCategory.find({ storeId });

    if (!specialCategories) {
      return next(errorHandler(404, "category not found"));
    }

    res.status(200).json(specialCategories);
  } catch (error) {
    console.log("GET_SPECIAL_CATEGORY", error);
    next(error);
  }
};

export const getSpecialCategory = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const specialCategories = await SpecialCategory.find({
      storeId,
      isActive: true,
    }).populate({
      path: "selectedProducts",
      populate: [
        {
          path: "brand",
          select: "brandName",
        },
        {
          path: "price",
        },
      ],
    });

    if (!specialCategories) {
      return next(errorHandler(404, "Category not found"));
    }

    res.status(200).json({
      message: "Special category fethed successfully",
      specialCategories,
    });
  } catch (error) {
    console.log("GET_SPECIAL_CATEGORY", error);
    next(error);
  }
};

export const getSpecialCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const specialCategory = await SpecialCategory.findById(id);

    if (!specialCategory) {
      return next(errorHandler(404, "category not found"));
    }

    res.status(200).json(specialCategory);
  } catch (error) {
    console.log("GET_SPECIAL_CATEGORY", error);
    next(error);
  }
};
