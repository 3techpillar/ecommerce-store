import Product from "../../models/product.model.js";
import Price from "../../models/price.model.js";
import Offer from "../../models/offer.model.js";
import { errorHandler } from "../../utils/error.js";

export const createProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
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
    let discountedPrice = price.amount;
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
      price: price.amount,
      offers: offerIds,
      total_discount: price.amount - discountedPrice,
      discounted_price: discountedPrice,
    });

    const createSlug = name
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/^a-zA-Z0-9/g, "");

    const newProduct = await Product.create({
      user: req.user.id,
      sku,
      name,
      slug: createSlug,
      product_type,
      thumbnail,
      images,
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
        keywords: seo.keywords || [],
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const updateProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
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
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          sku,
          name,
          product_type,
          thumbnail,
          images,
          attributes,
          brand,
          category,
          description,
          stock,
          is_instock: stock > 0,
          is_manage_stock,
          seo: {
            title: seo.title || null,
            description: seo.description || null,
            keywords: seo.keywords || [],
          },
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (price || offers) {
      const currentPrice = await Price.findById(updatedProduct.price);
      let priceAmount = price?.amount || currentPrice.price;
      let discountedPrice = priceAmount;

      if (offers && offers.length > 0) {
        const existingOffer = await Offer.findById(currentPrice.offers[0]);

        await Offer.findByIdAndUpdate(
          existingOffer._id,
          { $set: offers[0] },
          { new: true }
        );

        if (offers[0].offer_type === "flat" && offers[0].flat_value) {
          discountedPrice -= offers[0].flat_value;
        } else if (
          offers[0].offer_type === "percentage" &&
          offers[0].percentage_value
        ) {
          discountedPrice -=
            discountedPrice * (offers[0].percentage_value / 100);
        }

        discountedPrice = Math.max(discountedPrice, 0);

        await Price.findByIdAndUpdate(
          currentPrice._id,
          {
            $set: {
              price: priceAmount,
              total_discount: priceAmount - discountedPrice,
              discounted_price: discountedPrice,
            },
          },
          { new: true }
        );
      }
    }

    const finalProduct = await Product.findById(productId).populate({
      path: "price",
      populate: {
        path: "offers",
      },
    });

    res.status(200).json(finalProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
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
    const fetchProducts = await Product.find().populate({
      path: "price",
      populate: {
        path: "offers",
      },
    });

    if (!fetchProducts || fetchProducts.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(fetchProducts);
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

    const fetchProductById = await Product.findById(productId).populate({
      path: "price",
      populate: {
        path: "offers",
      },
    });

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
