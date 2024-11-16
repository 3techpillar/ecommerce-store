import FeaturedSection from "../../models/product/featuredProduct.model";
import { errorHandler } from "../../utils/error";

export const createFeaturedProduct = async (req, res, next) => {
  try {
    const { title, subtitle, displayLimit, selectedProducts, isActive } =
      req.body;

    if (!title) {
      return next(errorHandler(404, "Title is required"));
    }

    if (displayLimit < 1 || displayLimit > 12) {
      return next(errorHandler(400, "Display limit must be between 1 and 12"));
    }

    const newSection = await FeaturedSection.create({
      title,
      subtitle,
      displayLimit,
      selectedProducts,
      isActive,
    });

    res.status(201).json({
      message: "Featured section created successfully",
      data: newSection,
    });
  } catch (error) {
    console.log("POST_FEATURED_PRODUCT", error);
    next(error);
  }
};

export const updateFeaturedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSection = await FeaturedSection.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return next(errorHandler(404, "Featured section not found"));
    }

    res.status(200).json({
      message: "Featured section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log("PUT_FEATURED_PRODUCT", error);
    next(error);
  }
};

export const deleteFeaturedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteSection = await FeaturedSection.findByIdAndDelete(id);

    if (!deleteSection) {
      return next(errorHandler(404, "Featured section not found"));
    }

    res.status(200).json({
      message: "Featured section deleted successfully",
    });
  } catch (error) {
    console.log("DELETE_FEATURED_PRODUCT", error);
    next(error);
  }
};

export const getAllFeaturedProducts = async (req, res, next) => {
  try {
    const featuredProducts = await FeaturedSection.find();

    if (!featuredProducts) {
      return next(errorHandler(404, "Products not found"));
    }

    res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("GET_FEATURED_PRODUCTS", error);
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const featuredProducts = await FeaturedSection.find({ isActive: true });

    if (!featuredProducts) {
      return next(errorHandler(404, "Products not found"));
    }

    res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("GET_FEATURED_PRODUCTS", error);
    next(error);
  }
};

export const getFeaturedProductsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const featuredProducts = await FeaturedSection.findById(id);

    if (!featuredProducts) {
      return next(errorHandler(404, "Products not found"));
    }

    res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("GET_FEATURED_PRODUCTS", error);
    next(error);
  }
};
