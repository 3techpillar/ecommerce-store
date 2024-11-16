import api from "@/lib/axios";
import { Category } from "@/types/types";

export const getCategories = async (
  storeId: string | string[]
): Promise<Category[]> => {
  try {
    const response = await api.get(
      `/v1/category/get-category-by-storeId/${storeId}`
    );
    return response.data.categories;
  } catch (error) {
    console.error("Error while fetching categories", error);
    return [];
  }
};
