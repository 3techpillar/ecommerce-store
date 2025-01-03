import Product from "../../models/product/product.model.js";
import CategoryProduct from "../../models/product/productByCategory.model.js";
import { getAllChildCategories } from "../../utils/childCategory.js";
import { errorHandler } from "../../utils/error.js";

export const createCategoryProduct = async (req, res, next) => {
  if (!req.admin) {
    return next(errorHandler(403, "You are not allowed to create a category"));
  }

  try {
    const { storeId } = req.params;

    const { title, subTitle, displayLimit, category, isActive } = req.body;

    if (!title) {
      return next(errorHandler(404, "Title is required"));
    }

    if (displayLimit < 1 || displayLimit > 12) {
      return next(errorHandler(400, "Display limit must be between 1 and 12"));
    }

    const newSection = await CategoryProduct.create({
      storeId,
      title,
      subTitle,
      displayLimit,
      category,
      isActive,
    });

    res.status(201).json({
      message: "Category Product created successfully",
      data: newSection,
    });
  } catch (error) {
    console.log("POST_CATEGORY_PRODUCT", error);
    next(error);
  }
};

export const updateCategoryProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSection = await CategoryProduct.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return next(errorHandler(404, "Category Product not found"));
    }

    res.status(200).json({
      message: "Category product updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log("PUT_CATEGORY_PRODUCT", error);
    next(error);
  }
};

export const deleteCategoryProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteSection = await CategoryProduct.findByIdAndDelete(id);

    if (!deleteSection) {
      return next(errorHandler(404, "Category section not found"));
    }

    res.status(200).json({
      message: "Category section deleted successfully",
    });
  } catch (error) {
    console.log("DELETE_CATEGORY_PRODUCT", error);
    next(error);
  }
};

export const getAllCategoryProducts = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const categoryProducts = await CategoryProduct.find({ storeId }).populate(
      "category"
    );

    if (!categoryProducts) {
      return next(errorHandler(404, "category Products not found"));
    }

    res.status(200).json(categoryProducts);
  } catch (error) {
    console.log("GET_CATEGORY_PRODUCTS", error);
    next(error);
  }
};

//user
export const getCategoryProducts = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const categoryProductSettings = await CategoryProduct.find({
      storeId,
      isActive: true,
    }).populate("category");

    const result = await Promise.all(
      categoryProductSettings.map(async (categorySetting) => {
        const childCategoryIds = await getAllChildCategories(
          categorySetting.category._id
        );

        const allCategoryIds = [
          categorySetting.category._id,
          ...childCategoryIds,
        ];

        console.log(`Category ${categorySetting.category.name}:`, {
          storeId,
          allCategoryIds,
        });

        const productsExist = await Product.findOne({
          storeId,
          category: { $in: allCategoryIds },
        });

        console.log(
          `Products exist for ${categorySetting.category.name}:`,
          !!productsExist
        );

        const products = await Product.find({
          storeId,
          category: { $in: allCategoryIds },
        })
          .populate({
            path: "price",
            populate: {
              path: "offers",
            },
          })
          .sort({ createdAt: -1 })
          .limit(categorySetting.displayLimit);

        console.log(
          `Found ${products.length} products for ${categorySetting.category.name}`
        );

        return {
          categoryId: categorySetting.category._id,
          categoryName: categorySetting.category.name,
          title: categorySetting.title,
          subTitle: categorySetting.subTitle,
          displayLimit: categorySetting.displayLimit,
          products,
        };
      })
    );

    if (!result || !result.length) {
      return res.status(200).json({
        message: "No category products found",
        data: [],
      });
    }

    res.status(200).json({
      message: "Category products fetched successfully",
      result: result,
    });
  } catch (error) {
    console.log("GET_CATEGORY_PRODUCTS", error);
    next(error);
  }
};

export const getCategoryProductsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoryProduct = await CategoryProduct.findById(id).populate(
      "category"
    );

    if (!categoryProduct) {
      return next(errorHandler(404, "Category section not found"));
    }

    res.status(200).json(categoryProduct);
  } catch (error) {
    console.log("GET_CATEGORY_PRODUCTS", error);
    next(error);
  }
};
