"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const params = useParams();

  const fetchCategories = async () => {
    try {
      const response = await api.get(
        `/v1/category/get-category-by-storeId/${params.storeId}`
      );
      console.log("fetch categories:", response.data.categories);

      setCategories(response.data.categories);
    } catch (error) {
      console.log("Error while fetching category", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item._id,
    icon: item.icon,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default Categories;