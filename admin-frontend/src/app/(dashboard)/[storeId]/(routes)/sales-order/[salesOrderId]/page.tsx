"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { OrderForm } from "./components/order-form";

const OrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const [salesOrder, setSalesOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      if (params.salesOrderId === "new") {
        setSalesOrder(null);
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/v1/sales-order/get-by-id/${params.salesOrderId}`
      );
      console.log("sales order id", response);

      const salesOrder = response.data.salesOrder;

      if (salesOrder) {
        setSalesOrder(salesOrder);
      } else {
        setSalesOrder(null);
      }
    } catch (err) {
      console.error("Error fetching coupon:", err);
      setSalesOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.salesOrderId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!salesOrder && params.salesOrderId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">sales order not found</h1>
          <p>The requested sales order could not be found.</p>
          <Button onClick={() => router.push("/sales-order")}>
            Go back to sales order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm initialData={salesOrder} />
      </div>
    </div>
  );
};

export default OrderPage;
