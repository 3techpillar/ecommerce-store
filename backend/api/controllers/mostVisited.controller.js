import MostVisitedProduct from "../models/mostVisited.model.js";
import { errorHandler } from "../utils/error.js";

export const getMostVisitedProducts = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const mostVisitedProducts = await MostVisitedProduct.find({ storeId })
      .sort({ visitCount: -1 })
      .limit(10)
      .populate({
        path: "productId",
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

    if (!mostVisitedProducts || mostVisitedProducts.length === 0) {
      return next(errorHandler(400, "No most visited products found."));
    }

    res.status(200).json({
      message: "Most visited products retrieved.",
      products: mostVisitedProducts,
    });
  } catch (error) {
    console.error("GET_MOST_VISITED_PRODUCTS_ERROR:", error);
    next(error);
  }
};
