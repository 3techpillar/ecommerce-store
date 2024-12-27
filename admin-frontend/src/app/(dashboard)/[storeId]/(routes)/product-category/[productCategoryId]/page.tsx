"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { CategoryProductForm } from "./components/category-product-form";
import { Button } from "@/components/ui/button";

const FeaturedPage = () => {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFeaturdProducts = async () => {
    try {
      if (params.productCategoryId === "new") {
        setCategory(null);
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/v1/category-product/get-category-product/${params.productCategoryId}`
      );
      const fetchedCategoryProduct = response.data;

      setCategory(fetchedCategoryProduct);
    } catch (err) {
      console.error("Error fetching featured product:", err);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturdProducts();
  }, [params.productCategoryId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!category && params.productCategoryId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Category products not found</h1>
          <p>The requested category products could not be found.</p>
          <Button onClick={() => router.push("/featured")}>
            Go back to category products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryProductForm initialData={category} />
      </div>
    </div>
  );
};

export default FeaturedPage;
