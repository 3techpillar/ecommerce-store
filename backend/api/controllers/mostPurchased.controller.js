import MostPurchasedProduct from "../models/mostPurchased.model.js";
import { errorHandler } from "../utils/error.js";

export const getMostPurchasedProducts = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const mostPurchasedProducts = await MostPurchasedProduct.find({ storeId })
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

    if (!mostPurchasedProducts || mostPurchasedProducts.length === 0) {
      return next(errorHandler(400, "No most purchased products found."));
    }

    res.status(200).json({
      message: "Most purchased products retrieved.",
      products: mostPurchasedProducts,
    });
  } catch (error) {
    console.error("GET_MOST_PURCHASED_PRODUCTS_ERROR:", error);
    next(error);
  }
};
