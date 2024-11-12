"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ProductForm } from "./components/product-form";
import { Button } from "@/components/ui/button";

const CategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(product);

  const fetchProduct = async () => {
    try {
      if (params.productId === "new") {
        setProduct(null);
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/v1/product/get-product/${params.productId}`
      );
      const products = response.data;

      if (products) {
        setProduct(products);
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.productId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!product && params.productId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p>The requested product could not be found.</p>
          <Button onClick={() => router.push("/products")}>
            Go back to Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};

export default CategoryPage;
