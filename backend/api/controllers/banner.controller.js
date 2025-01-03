import Banner from "../models/banner.model.js";
import { errorHandler } from "../utils/error.js";

export const createBanner = async (req, res, next) => {
  // if (!req.admin) {
  //   return next(errorHandler(403, "You are not allowed to create a banner"));
  // }

  try {
    const {
      title,
      subTitle,
      image,
      buttonText,
      buttonLink,
      bannerPosition,
      displayOrder,
      isVisible,
      pageType,
    } = req.body;

    const { storeId } = req.params;

    if (!storeId) {
      return next(errorHandler(404, "Store Id is required"));
    }

    if (!image) {
      return next(
        errorHandler(400, "Title and at least one image URL is required")
      );
    }

    // const existingBannerOrder = await Banner.find({ displayOrder });

    // if (existingBannerOrder == displayOrder) {
    //   return next(
    //     errorHandler(
    //       400,
    //       "Banner with this order value already exist, Please change position"
    //     )
    //   );
    // }

    const newBanner = new Banner({
      storeId,
      title,
      subTitle,
      image,
      buttonText,
      buttonLink,
      bannerPosition,
      displayOrder,
      isVisible,
      pageType,
    });

    const savedBanner = await newBanner.save();

    return res.status(200).json({ message: "Banner created", savedBanner });
  } catch (error) {
    console.log("POST_BANNER", error);
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;
    const updateBanner = req.body;

    if (!bannerId) {
      return next(errorHandler(404, "Banner Id is required to update banner"));
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      {
        $set: updateBanner,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBanner) {
      return errorHandler(404, "Banner not found");
    }

    return res.status(200).json({ message: "Banner updated", updatedBanner });
  } catch (error) {
    console.log("PUT_BANNER", error);
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;

    if (!bannerId) {
      return next(errorHandler(404, "Banner Id is required to update banner"));
    }

    await Banner.findByIdAndDelete(bannerId);

    res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    console.log("DELETE_BANNER", error);
    next(error);
  }
};

export const getAllBanner = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return next(errorHandler(404, "Store id is required."));
    }
    const banners = await Banner.find({ storeId });

    if (banners.length === 0) {
      return next(errorHandler(404, "You dont have any banner, Create one"));
    }

    return res.status(200).json({ message: "Banners fetched", banners });
  } catch (error) {
    console.log("GET_BANNER", error);
  }
};

export const getBanners = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const banners = await Banner.find({ storeId, isVisible: true });

    if (!banners || !banners.length) {
      return res.status(200).json({
        message: "No banner found",
        banners: [],
      });
    }

    return res
      .status(200)
      .json({ message: "All visible banner fetched", banners });
  } catch (error) {
    console.log("GET_VISIBLE_BANNER", error);
    next(error);
  }
};

export const getBannerById = async (req, res, next) => {
  try {
    const { bannerId } = req.params;

    if (!bannerId) {
      return next(errorHandler(404, "Banner id is required"));
    }

    const banner = await Banner.findById(bannerId);

    if (banner.length === 0) {
      return next(errorHandler(404, "Banner not found"));
    }

    return res
      .status(200)
      .json({ message: "All visible banner fetched", banner });
  } catch (error) {
    console.log("GET_VISIBLE_BANNER", error);
    next(error);
  }
};
