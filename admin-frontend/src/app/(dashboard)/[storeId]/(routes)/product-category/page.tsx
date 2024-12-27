"use client";

import { useEffect, useState } from "react";

import { CategoryProductClient } from "./components/client";
import { CategoryProductColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

const ProductCategory = () => {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const params = useParams();

  console.log(categoryProducts);

  const fetchCategory = async () => {
    try {
      const response = await api.get(
        `/v1/category-product/get-all/${params.storeId}`
      );

      setCategoryProducts(response.data);
    } catch (error) {
      console.log("Error while fetching featured products", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const formattedCategoryProducts: CategoryProductColumn[] =
    categoryProducts.map((item) => ({
      id: item._id,
      title: item.title,
      category: item.category.name,
      subTitle: item.subTitle,
      isActive: item.isActive,
    }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryProductClient data={formattedCategoryProducts} />
      </div>
    </div>
  );
};

export default ProductCategory;
