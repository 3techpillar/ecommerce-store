"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { FeaturedProductForm } from "./components/featured-form";
import { Button } from "@/components/ui/button";

const FeaturedPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFeaturdProducts = async () => {
    try {
      if (params.featuredId === "new") {
        setProduct(null);
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/v1/featured/get-product/${params.featuredId}`
      );
      const fetchedProduct = response.data;

      setProduct(fetchedProduct);
    } catch (err) {
      console.error("Error fetching featured product:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturdProducts();
  }, [params.featuredId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!product && params.featuredId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Featured products not found</h1>
          <p>The requested featured products could not be found.</p>
          <Button onClick={() => router.push("/featured")}>
            Go back to featured products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FeaturedProductForm initialData={product} />
      </div>
    </div>
  );
};

export default FeaturedPage;
