"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { SpecialCategoryForm } from "./components/special-form";

const FeaturedPage = () => {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSpecialCategory = async () => {
    try {
      if (params.specialId === "new") {
        setCategory(null);
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/v1/special-category/get-category/${params.specialId}`
      );
      const specialCategory = response.data;

      setCategory(specialCategory);
    } catch (err) {
      console.error("Error fetching featured categories:", err);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialCategory();
  }, [params.specialId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!category && params.specialId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p>The requested category could not be found.</p>
          <Button onClick={() => router.push("/categories")}>
            Go back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SpecialCategoryForm initialData={category} />
      </div>
    </div>
  );
};

export default FeaturedPage;
