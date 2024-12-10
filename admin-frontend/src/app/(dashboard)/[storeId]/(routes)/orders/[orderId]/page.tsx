"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { OrderForm } from "./components/order-form";

const OrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      if (params.orderId === "new") {
        setOrder(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/v1/order/get-by-id/${params.orderId}`);
      const order = response.data.order;

      console.log("ashish" + order);

      if (order) {
        setOrder(order);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error("Error fetching coupon:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!order && params.orderId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <p>The requested Order could not be found.</p>
          <Button onClick={() => router.push("/order")}>
            Go back to order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm initialData={order} />
      </div>
    </div>
  );
};

export default OrderPage;
