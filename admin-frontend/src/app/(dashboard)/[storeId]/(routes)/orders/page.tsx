"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import useAuthStore from "@/store/userStore";

interface Store {
  id: string;
  name: string;
  currency: string;
}

interface Orders {
  _id: string;
  name: string;
  totalPriceAfterDiscount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const Order = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
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
      const response = await api.get(`/v1/order/${params.storeId}`);

      setOrders(response.data.orders);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formattedOrders: OrderColumn[] = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((item) => ({
      id: item._id,
      _id: item._id,
      name: item.user?.name ?? "N/A",
      totalPriceAfterDiscount: store?.currency
        ? formatPrice(item.totalPriceAfterDiscount, store.currency)
        : item.totalPriceAfterDiscount,
      paymentStatus: item.paymentStatus,
      orderStatus: item.orderStatus,
      createdAt: format(new Date(item.createdAt), "MMMM do yyyy, h:mm a"),
    }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default Order;
