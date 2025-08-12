"use client";

import { useEffect, useState } from "react";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import useAuthStore from "@/store/userStore";

interface Store {
  id: string;
  name: string;
  currency: string;
}

interface Product {
  _id: string;
  thumbnail: string;
  sku: string;
  name: string;
  price: {
    price: number;
  };
  category: { _id: string; name: string };
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/v1/product/${params.storeId}`);

        setProducts(response.data);
      } catch (error) {
        console.log("Error while fetching products", error);
      }
    };

    fetchProducts();
  }, [params.storeId]);

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item._id,
    thumbnail: item.thumbnail,
    sku: item.sku,
    name: item.name,
    price: store?.currency
      ? formatPrice(item.price.price, store.currency)
      : item.price.price,
    category: item.category?.name || "uncategorizes",
    categoryId: item.category?._id || "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default Products;
