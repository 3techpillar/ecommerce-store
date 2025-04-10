import MostVisitedProduct from "../../models/mostVisited.model.js";
import RecentView from "../../models/user/recentView.model.js";
import Product from "../../models/product/product.model.js";
import { errorHandler } from "../../utils/error.js";

export const addRecentView = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    if (!userId && !productId) {
      return next(errorHandler(400, "Both user and product are required."));
    }

    let recentView = await RecentView.findOne({ userId });

    if (recentView) {
      const existingProductIndex = recentView.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (existingProductIndex > -1) {
        recentView.products[existingProductIndex].viewedAt = new Date();
      } else {
        recentView.products.unshift({ productId });
      }

      if (recentView.products.length > 10) {
        recentView.products.pop();
      }

      await recentView.save();
    } else {
      recentView = await RecentView.create({
        userId,
        products: [{ productId }],
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(errorHandler(404, "Product not found."));
    }
    const storeId = product.storeId;

    let mostVisitedProducts = await MostVisitedProduct.findOne({
      productId,
      storeId,
    });

    if (mostVisitedProducts) {
      mostVisitedProducts.visitCount += 1;
    } else {
      mostVisitedProducts = new MostVisitedProduct({
        productId,
        storeId,
        visitCount: 1,
      });
    }

    await mostVisitedProducts.save();

    res
      .status(200)
      .json({ message: "Product added to recent views.", recentView });
  } catch (error) {
    console.error("ADD_RECENT_VIEW_ERROR:", error);
    next(error);
  }
};

export const getRecentViews = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const recentView = await RecentView.findOne({ userId })
      .populate({
        path: "products.productId",
        populate: [
          {
            path: "brand",
            select: "brandName",
          },
          {
            path: "price",
          },
        ],
      })
      .exec();

    if (!recentView || recentView.products.length === 0) {
      return res.status(200).json({
        message: "No recently viewed products found.",
        products: [],
      });
    }

    res.status(200).json({
      message: "Recently viewed products retrieved.",
      products: recentView.products,
    });
  } catch (error) {
    console.error("GET_RECENT_VIEWS_ERROR:", error);
    next(error);
  }
};
