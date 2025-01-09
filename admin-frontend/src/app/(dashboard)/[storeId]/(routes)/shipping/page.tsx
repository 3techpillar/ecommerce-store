"use client";

import { useEffect, useState } from "react";

import { ShippingClient } from "./components/client";
import { ShippingColumn } from "./components/columns";
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
  type: string;
  charges: number;
  isActive: boolean;
}

const Shipping = () => {
  const [shipping, setShipping] = useState<Coupons[]>([]);
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

  const fetchShipping = async () => {
    try {
      const response = await api.get(`/v1/shipping/${params.storeId}`);

      setShipping(response.data.shipping);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  const formattedShipping: ShippingColumn[] = shipping.map((item) => ({
    id: item._id,
    type: item.type,
    charges: store?.currency
      ? formatPrice(item.charges, store.currency)
      : item.charges,
    isActive: item.isActive,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShippingClient data={formattedShipping} />
      </div>
    </div>
  );
};

export default Shipping;
