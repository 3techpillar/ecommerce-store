"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { columns, MostPurchasedProductsColumn } from "./column";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { DataTable } from "@/components/ui/data-table";

const MostVisited = () => {
  const [mostPurchasedProducts, setMostPurchasedProducts] = useState<
    MostPurchasedProductsColumn[]
  >([]);

  const params = useParams();

  const fetchMostPurchasedProducts = async () => {
    try {
      const response = await api.get(
        `/v1/most-purchased/products/${params.storeId}`
      );

      setMostPurchasedProducts(response.data.products);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  useEffect(() => {
    fetchMostPurchasedProducts();
  }, []);

  const formattedProduct: MostPurchasedProductsColumn[] =
    mostPurchasedProducts.map((item) => ({
      id: item._id,
      thumbnail: item.productId.thumbnail,
      name: item.productId.name,
      purchaseCount: item.purchaseCount,
    }));

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Most Purchased Products`}
          description="Most purchased products of your business"
        />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={formattedProduct}
        searchableColumns={["name"]}
      />
    </div>
  );
};

export default MostVisited;
