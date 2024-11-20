import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const categorySchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      default: 0,
    },
    attributes: {
      type: [attributeSchema],
      default: [],
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    metaKeywords: {
      type: String,
      default: "",
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    banner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Banner",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.statics.findDescendants = async function (categoryId) {
  const categories = await this.find({ parentCategory: categoryId });
  const descendants = [];

  for (const category of categories) {
    const childDescendants = await this.findDescendants(category._id);
    descendants.push({
      ...category.toObject(),
      children: childDescendants,
    });
  }

  return descendants;
};

const Category = mongoose.model("Category", categorySchema);

export default Category;
