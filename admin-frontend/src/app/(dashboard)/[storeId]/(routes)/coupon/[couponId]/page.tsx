"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { CouponForm } from "./components/coupon-form";
import { Button } from "@/components/ui/button";

const CouponPage = () => {
  const params = useParams();
  const router = useRouter();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("INDIVIDUAL" + coupon);

  const fetchCoupon = async () => {
    try {
      if (params.couponId === "new") {
        setCoupon(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/v1/coupon/get-by-id/${params.couponId}`);
      const coupon = response.data.coupon;

      if (coupon) {
        setCoupon(coupon);
      } else {
        setCoupon(null);
      }
    } catch (err) {
      console.error("Error fetching coupon:", err);
      setCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [params.couponId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!coupon && params.couponId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Coupon not found</h1>
          <p>The requested product could not be found.</p>
          <Button onClick={() => router.push("/coupon")}>
            Go back to Coupon
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CouponForm initialData={coupon} />
      </div>
    </div>
  );
};

export default CouponPage;
