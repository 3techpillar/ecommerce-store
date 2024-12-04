"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { CouponClient } from "./components/client";
import { CouponColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import useAuthStore from "@/store/userStore";

interface Store {
  id: string;
  name: string;
  currency: string;
}

interface Coupons {
  _id: string;
  code: string;
  expires: string;
  discountType: string;
  discount: number;
  minPrice: number;
  isActive: boolean;
}

const Coupon = () => {
  const [coupons, setCoupons] = useState<Coupons[]>([]);
  const [store, setStore] = useState<Store | null>(null);

  const { user } = useAuthStore();
  const router = useRouter();

  const params = useParams();

  useEffect(() => {
    const fetchStore = async () => {
      if (!user?._id || !params.storeId) {
        router.push("/sign-in");
        return;
      }

      try {
        const response = await api.get<Store>(
          `/v1/setting/get-store-by-userid/${user._id}/${params.storeId}`
        );
        setStore(response.data);
      } catch (err) {
        console.error("Error fetching store:", err);
        router.push("/");
      }
    };

    fetchStore();
  }, [user, params.storeId, router]);

  const fetchCoupons = async () => {
    try {
      const response = await api.get(`/v1/coupon/${params.storeId}`);

      setCoupons(response.data.coupons);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const formattedCoupons: CouponColumn[] = coupons.map((item) => ({
    id: item._id,
    code: item.code,
    expires: format(item.expires, "MMMM do yyyy, h:mm a"),
    discountType: item.discountType,
    discount: item.discount,
    minPrice: store?.currency
      ? formatPrice(item.minPrice, store.currency)
      : item.minPrice,
    isActive: item.isActive,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CouponClient data={formattedCoupons} />
      </div>
    </div>
  );
};

export default Coupon;
