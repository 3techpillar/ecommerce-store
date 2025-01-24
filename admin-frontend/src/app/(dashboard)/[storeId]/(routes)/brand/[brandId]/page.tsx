"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { BrandForm } from "./components/billboard-form";
import { Button } from "@/components/ui/button";

const BrandPage = () => {
  const params = useParams();
  const router = useRouter();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBrand = async () => {
    try {
      if (params.brandId === "new") {
        setBrand(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/v1/brand/${params.brandId}`);
      const fetchedBrand = response.data.brand;

      if (fetchedBrand) {
        setBrand(fetchedBrand);
      } else {
        setBrand(null);
      }
    } catch (err) {
      console.error("Error fetching brand:", err);
      setBrand(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [params.brandId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!brand && params.brandId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Brand not found</h1>
          <p>The requested brand could not be found.</p>
          <Button onClick={() => router.push(`/${params.storeId}/brand`)}>
            Go back to brand
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BrandForm initialData={brand} />
      </div>
    </div>
  );
};

export default BrandPage;
