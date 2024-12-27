import Category from "../models/categories/category.model.js";

export const getAllChildCategories = async (categoryId) => {
  const categories = await Category.find({ parentCategory: categoryId });
  let allCategoryIds = categories.map((category) => category._id);

  for (const category of categories) {
    const childCategories = await getAllChildCategories(category._id);
    allCategoryIds = allCategoryIds.concat(childCategories);
  }

  return allCategoryIds;
};
