import mongoose from "mongoose";
import Product from "../../models/product/product.model.js";
import Price from "../../models/product/price.model.js";
import Offer from "../../models/product/offer.model.js";
import Image from "../../models/product/images.model.js";
import Category from "../../models/categories/category.model.js";
import { errorHandler } from "../../utils/error.js";

export const createProduct = async (req, res, next) => {
  if (!req.admin) {
    return next(errorHandler(403, "You are not allowed to create a product"));
  }

  const {
    sku,
    name,
    product_type,
    thumbnail,
    images,
    attributes,
    brand,
    category,
    description,
    price,
    offers,
    stock,
    is_manage_stock,
    seo,
  } = req.body;

  try {
    let offerIds = [];
    let discountedPrice = price.price;
    let createdOffers = [];

    if (offers && offers.length > 0) {
      createdOffers = await Offer.insertMany(offers);
      offerIds = createdOffers.map((offer) => offer._id);
    }

    for (const offer of createdOffers) {
      if (offer.offer_type === "flat" && offer.flat_value) {
        discountedPrice -= offer.flat_value;
      } else if (offer.offer_type === "percentage" && offer.percentage_value) {
        discountedPrice -= discountedPrice * (offer.percentage_value / 100);
      }
    }

    discountedPrice = Math.max(discountedPrice, 0);

    const createdPrice = await Price.create({
      price: price.price,
      offers: offerIds,
      total_discount: price.price - discountedPrice,
      discounted_price: discountedPrice,
    });

    const createSlug = name
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/^a-zA-Z0-9/g, "");

    const { storeId } = req.params;

    const newProduct = await Product.create({
      storeId,
      sku,
      name,
      slug: createSlug,
      product_type,
      thumbnail,
      images: images || [],
      attributes,
      brand,
      category,
      description,
      price: createdPrice._id,
      stock,
      is_instock: stock > 0,
      is_manage_stock,
      seo: {
        title: seo.title || null,
        description: seo.description || null,
        keywords: seo.keywords || null,
      },
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const updateProduct = async (req, res, next) => {
  if (!req.admin) {
    return next(errorHandler(403, "You are not allowed to update a product"));
  }

  const { productId } = req.params;
  const {
    sku,
    name,
    product_type,
    thumbnail,
    images,
    attributes,
    brand,
    category,
    description,
    price,
    offers,
    stock,
    is_instock,
    is_manage_stock,
    seo,
  } = req.body;

  try {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedFields = {
      sku,
      name,
      product_type,
      thumbnail,
      attributes,
      brand,
      category,
      description,
      stock,
      is_instock,
      is_manage_stock,
      seo: {
        title: seo?.title || null,
        description: seo?.description || null,
        keywords: seo?.keywords || null,
      },
    };

    if (name) {
      updatedFields.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
    }

    // Update offers and calculate discounted price
    let discountedPrice = price?.price || existingProduct.price.price;
    let offerIds = [];

    if (offers && offers.length > 0) {
      await Offer.deleteMany({ _id: { $in: existingProduct.price.offers } });
      const newOffers = await Offer.insertMany(offers);
      offerIds = newOffers.map((offer) => offer._id);

      newOffers.forEach((offer) => {
        if (offer.offer_type === "flat" && offer.flat_value) {
          discountedPrice -= offer.flat_value;
        } else if (
          offer.offer_type === "percentage" &&
          offer.percentage_value
        ) {
          discountedPrice -= discountedPrice * (offer.percentage_value / 100);
        }
      });

      discountedPrice = Math.max(discountedPrice, 0);
    } else {
      offerIds = existingProduct.price.offers;
    }

    // Update price document
    const updatedPrice = await Price.findByIdAndUpdate(
      existingProduct.price._id,
      {
        price: price?.price || existingProduct.price.price,
        offers: offerIds,
        total_discount: price?.price - discountedPrice,
        discounted_price: discountedPrice,
      },
      { new: true }
    );

    updatedFields.price = updatedPrice._id;

    // Update product document
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedFields },
      { new: true }
    ).populate({
      path: "price",
      populate: { path: "offers" },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req, res, next) => {
  if (!req.admin) {
    return next(errorHandler(403, "You are not allowed to delete a product"));
  }

  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = await Price.findById(product.price);

    if (price) {
      if (price.offers && price.offers.length > 0) {
        await Offer.deleteMany({ _id: { $in: price.offers } });
      }

      await Price.deleteOne({ _id: price._id });
    }

    await Product.deleteOne({ _id: productId });

    res.status(200).json({
      message: "Product, price, and associated offers deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const products = await Product.find({ storeId })
      .populate({
        path: "price",
        populate: {
          path: "offers",
        },
      })
      .populate("category");
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required" });
    }

    const {
      category,
      brand,
      minPrice,
      maxPrice,
      sort = "desc",
      limit = 10,
      page = 1,
      search,
    } = req.query;

    // Base filter with storeId
    const filter = { storeId: new mongoose.Types.ObjectId(storeId) };

    // search filter
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { sku: searchRegex },
        { "seo.title": searchRegex },
        { "seo.description": searchRegex },
        { "seo.keywords": searchRegex },
      ];
    }

    // Category filter
    if (category) {
      const categoryDoc = await Category.findOne({
        storeId: storeId,
        name: { $regex: new RegExp(category, "i") },
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    // Brand filter
    if (brand) {
      filter.brand = { $regex: new RegExp(brand, "i") };
    }

    // Sort configuration
    const sortOrder = sort === "asc" ? 1 : -1;
    const sortOption = { "priceData.price": sortOrder };

    const skip = (Number(page) - 1) * Number(limit);

    // Aggregate pipeline
    const aggregatePipeline = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "prices",
          localField: "price",
          foreignField: "_id",
          as: "priceData",
        },
      },
      {
        $unwind: "$priceData",
      },
      // Price range filter
      ...(minPrice || maxPrice
        ? [
            {
              $match: {
                "priceData.price": {
                  ...(minPrice && { $gte: Number(minPrice) }),
                  ...(maxPrice && { $lte: Number(maxPrice) }),
                },
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $lookup: {
          from: "offers",
          localField: "priceData.offers",
          foreignField: "_id",
          as: "priceData.offers",
        },
      },
      {
        $sort: sortOption,
      },
      {
        $skip: skip,
      },
      {
        $limit: Number(limit),
      },
    ];

    // Execute aggregation
    const products = await Product.aggregate(aggregatePipeline);

    // Get total count for this store
    const totalProducts = await Product.countDocuments(filter);

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found for this store",
        currentPage: Number(page),
        totalPages: 0,
        totalProducts: 0,
        products: [],
      });
    }

    res.status(200).json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const fetchProductById = await Product.findById(productId)
      .populate({
        path: "price",
        populate: {
          path: "offers",
        },
      })
      .populate("images");

    if (!fetchProductById || fetchProductById.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(fetchProductById);
  } catch (error) {
    console.error("Error fetching single product:", error);
    res
      .status(500)
      .json({ message: "Error fetching single product", error: error.message });
  }
};
