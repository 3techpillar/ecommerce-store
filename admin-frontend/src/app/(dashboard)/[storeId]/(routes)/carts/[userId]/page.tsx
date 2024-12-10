"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { CartForm } from "./components/cart-form";

const CartsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      if (params.userId === "new") {
        setCart(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/v1/cart/get-by-userId/${params.userId}`);
      const cart = response.data.cart;

      if (cart) {
        setCart(cart);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [params.userId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!cart && params.userId !== "new") {
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
        <CartForm initialData={cart} />
      </div>
    </div>
  );
};

export default CartsPage;
