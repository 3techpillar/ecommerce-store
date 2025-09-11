"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { SpecialClient } from "./components/specialClient";
import { SpecialCategoryColumn } from "./components/specialColumn";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [specialCategory, setSpecialCategory] = useState([]);
  const params = useParams();

  const fetchCategories = async () => {
    try {
      const response = await api.get(
        `/v1/category/get-category-by-storeId/${params.storeId}`
      );

      setCategories(response.data.categories);
    } catch (error) {
      console.log("Error while fetching category", error);
    }
  };

  const fetchSpecialCategory = async () => {
    try {
      const response = await api.get(
        `/v1/special-category/get-all/${params.storeId}`
      );
      console.log("fetch categories:", response.data.specialCategories);

      setSpecialCategory(response.data);
    } catch (error) {
      console.log("Error while fetching special category", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSpecialCategory();
  }, []);

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item._id,
    icon: item.icon,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do yyyy"),
  }));

  const formattedSpecialCategories: SpecialCategoryColumn[] =
    specialCategory.map((item) => ({
      id: item._id,
      title: item.title,
      subTitle: item.subTitle,
      isActive: item.isActive,
    }));

  return (
    <div className="flex flex-col space-y-6 p-4 md:p-8 ">
       
        <SpecialClient data={formattedSpecialCategories} />
        <CategoryClient data={formattedCategories} />
      </div>
     
  );
};

export default Categories;
