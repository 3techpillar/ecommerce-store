"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { CategoryForm } from "./components/category-form";
import { Button } from "@/components/ui/button";

const CategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      if (params.categoryId === "new") {
        setCategory(null);
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/v1/category/get-category/${params.categoryId}`
      );
      const fetchedCategory = response.data.category;

      if (fetchedCategory) {
        setCategory(fetchedCategory);
      } else {
        setCategory(null);
      }
    } catch (err) {
      console.error("Error fetching category:", err);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [params.categoryId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!category && params.categoryId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p>The requested category could not be found.</p>
          <Button onClick={() => router.push("/categories")}>
            Go back to categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
