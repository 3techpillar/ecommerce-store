import Wishlist from "../../models/user/wishlist.model.js";
import Product from "../../models/product/product.model.js";
import { errorHandler } from "../../utils/error.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return next(errorHandler(400, "Invalid input data"));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(errorHandler(404, "Product not found"));
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [],
      });
    }

    if (wishlist.products.includes(productId)) {
      return next(errorHandler(400, "Product already in wishlist"));
    }

    wishlist.products.push(productId);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error("ADD_TO_WISHLIST:", error);
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return next(errorHandler(400, "Invalid input data"));
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return next(errorHandler(404, "Wishlist not found"));
    }

    const productIndex = wishlist.products.indexOf(productId);
    if (productIndex === -1) {
      return next(errorHandler(404, "Product not found in wishlist"));
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error("REMOVE_FROM_WISHLIST:", error);
    next(error);
  }
};

export const clearWishlist = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return next(errorHandler(404, "Wishlist not found"));
    }

    wishlist.products = [];

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    console.log("POST_CLEARWISHLIST");
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId }).populate([
      {
        path: "products",
        populate: [{ path: "price" }, { path: "brand" }],
      },
    ]);
    if (!wishlist) {
      return next(errorHandler(404, "Wishlist not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    console.log("GET_WISHLIST");
    next(error);
  }
};
