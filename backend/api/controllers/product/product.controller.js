import Product from "../../models/product/product.model.js";
import Price from "../../models/product/price.model.js";
import Offer from "../../models/product/offer.model.js";
import Image from "../../models/product/images.model.js";
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
      images: [],
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

    if (images && images.length > 0) {
      const imageIds = await Promise.all(
        images.map(async (imageUrl) => {
          const newImage = await Image.create({
            productId: newProduct._id,
            url: imageUrl,
          });
          return newImage._id;
        })
      );

      newProduct.images = imageIds;
      await newProduct.save();
    }

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
    is_manage_stock,
    seo,
  } = req.body;

  try {
    // Find existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update basic product fields
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
      is_instock: stock > 0,
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

    // Update images if provided
    if (images && images.length > 0) {
      await Image.deleteMany({ productId });
      const imageDocs = await Promise.all(
        images.map(async (url) => {
          const image = await Image.create({ productId, url });
          return image._id;
        })
      );
      updatedFields.images = imageDocs;
    }

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

export const getAllProduct = async (req, res, next) => {
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
