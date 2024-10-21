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

    const newProduct = await Product.create({
      user: req.user.id,
      sku,
      name,
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
        },
      },
      { new: true }
    );

    if (price) {
      const updatedPrice = await Price.findByIdAndUpdate(
        updateProduct.price,
        {
          $set: {
            price: price.amount,
          },
        },
        { new: true }
      );

      let discountedPrice = price.amount;

      if (offers && offers.length > 0) {
        const createdOffers = await Offer.insertMany(offers);
        const offerIds = createdOffers.map((offer) => offer._id);

        updatedPrice.offers = offerIds;

        for (const offer of createdOffers) {
          if (offer.offer_type === "flat" && offer.flat_value) {
            discountedPrice -= offer.flat_value;
          } else if (
            offer.offer_type === "percentage" &&
            offer.percentage_value
          ) {
            discountedPrice -= discountedPrice * (offer.percentage_value / 100);
          }
        }

        discountedPrice = Math.max(discountedPrice, 0);

        updatedPrice.total_discount = price.amount - discountedPrice;
        updatedPrice.discounted_price = discountedPrice;

        await updatedPrice.save();
      }
    }

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};
