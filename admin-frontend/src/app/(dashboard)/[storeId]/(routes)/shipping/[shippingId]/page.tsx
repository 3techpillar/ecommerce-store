"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ShippingForm } from "./components/coupon-form";
import { Button } from "@/components/ui/button";

const ShippingPage = () => {
  const params = useParams();
  const router = useRouter();
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShipping = async () => {
    try {
      if (params.shippingId === "new") {
        setShipping(null);
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/v1/shipping/get-by-id/${params.shippingId}`
      );
      const shipping = response.data.shipping;

      if (shipping) {
        setShipping(shipping);
      } else {
        setShipping(null);
      }
    } catch (err) {
      console.error("Error fetching shipping charges:", err);
      setShipping(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, [params.shippingId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-4 text-center pt-6">Loading...</div>
      </div>
    );
  }

  if (!shipping && params.shippingId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-4  text-center pt-6">
          <h1 className="text-2xl font-bold">Shipping charges not found</h1>
          <p>The requested shipping charges could not be found.</p>
          <Button onClick={() => router.push("/shipping")}>
            Go back to shipping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-4 sm:p-6 md:p-8">
        <ShippingForm initialData={shipping} />
      </div>
    </div>
  );
};

export default ShippingPage;
