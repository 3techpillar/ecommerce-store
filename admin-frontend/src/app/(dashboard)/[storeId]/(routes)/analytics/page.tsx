"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { AnalyticsClient } from "./components/client";
import api from "@/lib/axios";
import { MostVisitedProductsColumn } from "./most-visited/column";
import { MostPurchasedProductsColumn } from "./most-purchased/column";

const Analytics = () => {
  const [mostVisitedProducts, setMostVisitedProducts] = useState<
    MostVisitedProductsColumn[]
  >([]);
  const [mostPurchasedProducts, setmostPurchasedProducts] =
    useState<MostPurchasedProductsColumn>([]);

  const params = useParams();

  const fetchMostVisitedProducts = async () => {
    try {
      const response = await api.get(
        `/v1/most-visited/products/${params.storeId}`
      );

      setMostVisitedProducts(response.data.products);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  const fetchMostPurchasedProducts = async () => {
    try {
      const response = await api.get(
        `/v1/most-purchased/products/${params.storeId}`
      );

      setmostPurchasedProducts(response.data.products);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  useEffect(() => {
    fetchMostVisitedProducts();
    fetchMostPurchasedProducts();
  }, []);

  const formattedVisitedProduct = mostVisitedProducts.map((item) => ({
    id: item._id,
    name: item.productId.name,
    thumbnail: item.productId.thumbnail,
    visitCount: item.visitCount,
  }));

  const formattedPurchasedProduct = mostPurchasedProducts.map((item) => ({
    id: item._id,
    name: item.productId.name,
    thumbnail: item.productId.thumbnail,
    purchaseCount: item.purchaseCount,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <AnalyticsClient
          mostVisited={formattedVisitedProduct}
          mostPurchased={formattedPurchasedProduct}
        />
      </div>
    </div>
  );
};

export default Analytics;
