"use client";

import { useEffect, useState } from "react";

import { CartClient } from "./components/client";
import { CartColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import useAuthStore from "@/store/userStore";

interface Store {
  id: string;
  name: string;
  currency: string;
}

interface Carts {
  _id: string;
  user: string;
  name: string;
  email: number;
  phone: string;
  products: string;
  netPrice: number;
}

const Order = () => {
  const [orders, setOrders] = useState<Carts[]>([]);
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

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/v1/cart/get-by-store/${params.storeId}`);

      setOrders(response.data.filteredCarts);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formattedCarts: CartColumn[] = orders.map((item) => ({
    id: item._id,
    user: item.user._id,
    name: item.user.name,
    email: item.user.email,
    phone: item.user.phone,
    products: item.items.length,
    netPrice: store?.currency
      ? formatPrice(item.netPrice, store.currency)
      : item.netPrice,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
        <CartClient data={formattedCarts} />
      </div>
    </div>
  );
};

export default Order;
