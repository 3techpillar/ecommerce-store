import Category from "../../models/category.model.js";
import { errorHandler } from "../../utils/error.js";

export const createCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a category"));
  }

  try {
    const {
      name,
      description,
      icon,
      isActive,
      position,
      attributes,
      metaTitle,
      metaDescription,
      metaKeywords,
      parentCategory,
    } = req.body;

    if (!name) {
      return next(errorHandler(400, "Category name is required"));
    }

    if (parentCategory) {
      const parent = await Category.findById(parentCategory);

      if (!parent) {
        return next(errorHandler(400, "Parent category not found"));
      }
    }

    const newCategory = new Category({
      name,
      description,
      icon,
      isActive,
      position,
      attributes,
      metaTitle,
      metaDescription,
      metaKeywords,
      parentCategory: parentCategory || null,
    });

    await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a category"));
  }

  try {
    const { categoryId } = req.params;
    const {
      name,
      description,
      icon,
      isActive,
      position,
      attributes,
      metaTitle,
      metaDescription,
      metaKeywords,
      parentCategory,
    } = req.body;

    if (!categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }

    if (parentCategory) {
      const parent = await Category.findById(parentCategory);

      if (!parent) {
        return next(errorHandler(400, "Parent category not found"));
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        $set: {
          name,
          description,
          icon,
          isActive,
          position,
          attributes,
          metaTitle,
          metaDescription,
          metaKeywords,
          parentCategory,
        },
      },
      { new: true }
    );

    if (!updatedCategory) {
      return next(errorHandler(404, "Category not found"));
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a category"));
  }

  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }

    const deleteCategoryRecursively = async (id) => {
      const childCategory = await Category.find({ parentCategory: id });

      for (const child of childCategory) {
        await deleteCategoryRecursively(child._id);
      }

      await Category.findByIdAndDelete(id);
    };

    await deleteCategoryRecursively(categoryId);

    return res.status(200).json({
      message: "Category and its subcategories deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getAllCategories = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a category"));
  }

  try {
    const topLevelCategory = await Category.find({ parentCategory: null });

    const categoriesWithChildren = await Promise.all(
      topLevelCategory.map(async (category) => ({
        ...category.toObject(),
        children: await Category.findDescendants(category._id),
      }))
    );

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories: categoriesWithChildren,
    });
  } catch (error) {
    return next(errorHandler(500, "Server error", error.message));
  }
};