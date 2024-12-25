import Category from "../../models/categories/category.model.js";
import { errorHandler } from "../../utils/error.js";

export const createCategory = async (req, res, next) => {
  if (!req.admin) {
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
      banner,
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

    const { storeId } = req.params;

    let slug;
    if (parentCategory) {
      const parentCat = await Category.findById(parentCategory);
      slug = `${parentCat.slug}/${name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")}`;
    } else {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    const newCategory = new Category({
      storeId,
      name,
      description,
      icon,
      slug,
      isActive,
      position,
      attributes,
      metaTitle,
      metaDescription,
      metaKeywords,
      parentCategory: parentCategory || null,
      banner,
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

export const getCategoryById = async (req, res, next) => {
  if (!req.admin) {
    return next(
      errorHandler(403, "You are not allowed to access this category")
    );
  }

  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }

    return res.status(200).json({
      message: "Category fetched successfully",
      category: category,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateCategory = async (req, res, next) => {
  if (!req.admin) {
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
      banner,
    } = req.body;

    if (!categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return next(errorHandler(404, "Category not found"));
    }

    if (parentCategory) {
      const parent = await Category.findById(parentCategory);

      if (!parent) {
        return next(errorHandler(400, "Parent category not found"));
      }
    }

    const updateData = {
      description,
      icon,
      isActive,
      position,
      attributes,
      metaTitle,
      metaDescription,
      metaKeywords,
      parentCategory,
      banner,
    };

    if (name && name !== existingCategory.name) {
      updateData.name = name;

      if (parentCategory) {
        const parentCat = await Category.findById(parentCategory);
        updateData.slug = `${parentCat.slug}/${name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")}`;
      } else {
        updateData.slug = name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updateData },
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
  if (!req.admin) {
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
  const { storeId } = req.params;

  try {
    const topLevelCategory = await Category.find({
      storeId,
      isActive: true,
      parentCategory: null,
    });

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

export const getCategoriesByStoreId = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const categories = await Category.find({ storeId });

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(error);
  }
};

export const getActiveCategories = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const categories = await Category.find({ storeId, isActive: true });

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(error);
  }
};
