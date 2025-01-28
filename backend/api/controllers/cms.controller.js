import Cms from "../models/cms.model.js";
import { errorHandler } from "../utils/error.js";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const createCms = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { title, subtitle, description, image, isActive } = req.body;

    const slug = generateSlug(title);

    const existingPage = await Cms.findOne({ slug });
    if (existingPage) {
      return next(errorHandler(400, "A page with this title already exists"));
    }

    const cms = await Cms.create({
      storeId,
      title,
      slug,
      subtitle,
      description,
      image,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      cms,
    });
  } catch (error) {
    console.error("CREATE_CMS_ERROR:", error);
    next(error);
  }
};

export const updateCms = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, image, isActive } = req.body;

    const cms = await Cms.findById(id);
    if (!cms) {
      return next(errorHandler(404, "Page not found"));
    }

    let slug = cms.slug;
    if (title && title !== cms.title) {
      slug = generateSlug(title);
    }

    const updatedCms = await Cms.findByIdAndUpdate(
      id,
      {
        title: title || cms.title,
        slug,
        subtitle: subtitle || cms.subtitle,
        description: description || cms.description,
        image: image || cms.image,
        isActive: isActive !== undefined ? isActive : cms.isActive,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      cms: updatedCms,
    });
  } catch (error) {
    console.error("UPDATE_CMS_ERROR:", error);
    next(error);
  }
};

export const getCms = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const cms = await Cms.findOne({
      slug,
      isActive: true,
    });

    if (!cms) {
      return next(errorHandler(404, "Page not found"));
    }

    res.status(200).json({
      success: true,
      cms,
    });
  } catch (error) {
    console.error("GET_CMS_ERROR:", error);
    next(error);
  }
};

export const getCmsById = async (req, res, next) => {
  try {
    const { cmsId } = req.params;

    const cms = await Cms.findById(cmsId);

    if (!cms) {
      return next(errorHandler(404, "Page not found"));
    }

    res.status(200).json({
      success: true,
      cms,
    });
  } catch (error) {
    console.error("GET_BY_ID_CMS_ERROR:", error);
    next(error);
  }
};

export const getAllCms = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const cms = await Cms.find({ storeId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      cms,
    });
  } catch (error) {
    console.error("GET_ALL_CMS_ERROR:", error);
    next(error);
  }
};

export const getActiveCms = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const cms = await Cms.find({ storeId, isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      cms,
    });
  } catch (error) {
    console.error("GET_ALL_CMS_ERROR:", error);
    next(error);
  }
};

export const deleteCms = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cms = await Cms.findById(id);
    if (!cms) {
      return next(errorHandler(404, "Page not found"));
    }

    await cms.deleteOne();

    res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_CMS_ERROR:", error);
    next(error);
  }
};
