"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { CategoryClient } from "./components/client";
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

const Products = () => {
  const [products, setProducts] = useState([]);
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

  const fetchProducts = async () => {
    try {
      const response = await api.get(
        `/v1/product/get-products/${params.storeId}`
      );

      setProducts(response.data);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formattedCategories: ProductColumn[] = products.map((item) => ({
    id: item._id,
    thumbnail: item.thumbnail,
    sku: item.sku,
    name: item.name,
    price: store?.currency
      ? formatPrice(item.price.price, store.currency)
      : item.price.price,
    category: item.category.name,
    createdAt: format(item.createdAt, "MMMM do yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default Products;
