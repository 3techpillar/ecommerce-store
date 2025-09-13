"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { columns, MostVisitedProductsColumn } from "./column";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { DataTable } from "@/components/ui/data-table";

const MostVisited = () => {
  const [mostVisitedProducts, setMostVisitedProducts] = useState<
    MostVisitedProductsColumn[]
  >([]);

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

  useEffect(() => {
    fetchMostVisitedProducts();
  }, []);

  const formattedProduct: MostVisitedProductsColumn[] = mostVisitedProducts.map(
    (item) => ({
      id: item._id,
      thumbnail: item.productId.thumbnail,
      name: item.productId.name,
      visitCount: item.visitCount,
    })
  );

  return (
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Heading
          title={`Most Visited Products`}
          description="Most visited products of your business"
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
