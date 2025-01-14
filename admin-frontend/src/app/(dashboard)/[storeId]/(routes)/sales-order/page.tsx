"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { SalesOrderClient } from "./components/client";
import { SalesOrderColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import useAuthStore from "@/store/userStore";

interface Store {
  id: string;
  name: string;
  currency: string;
}

interface SalesOrders {
  _id: string;
  product: {
    thumbnail: string;
    name: string;
  };
  totalPrice: number;
  quantity: string;
  orderId: string;
}

const Order = () => {
  const [salesOrders, setSalesOrders] = useState<SalesOrders[]>([]);
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
      const response = await api.get(`/v1/sales-order/${params.storeId}`);

      setSalesOrders(response.data.salesOrders);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formattedSalesOrders: SalesOrderColumn[] = salesOrders.map((item) => ({
    _id: item._id,
    thumbnail: item.product.thumbnail,
    name: item.product.name,
    totalPrice: store?.currency
      ? formatPrice(item.totalPrice, store.currency)
      : item.totalPrice,
    quantity: item.quantity,
    orderId: item.orderId,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SalesOrderClient data={formattedSalesOrders} />
      </div>
    </div>
  );
};

export default Order;
