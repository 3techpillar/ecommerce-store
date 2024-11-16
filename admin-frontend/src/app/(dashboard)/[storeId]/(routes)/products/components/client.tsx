"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, ProductColumn } from "./columns";
import FilterProduct from "./filter";

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [filteredData, setFilteredData] = useState<ProductColumn[]>(data);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    if (data.length > 0) {
      const prices = data.map((item) =>
        typeof item.price === "string"
          ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
          : item.price
      );
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
      setFilteredData(data);
    }
  }, [data]);

  const handleFiltersChange = ({
    categories,
    priceRange,
  }: {
    categories: string[];
    priceRange: [number, number];
  }) => {
    let filtered = [...data];

    if (categories.length > 0) {
      filtered = filtered.filter((product) =>
        categories.includes(product.categoryId)
      );
    }

    filtered = filtered.filter((product) => {
      const price =
        typeof product.price === "string"
          ? parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
          : product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFilteredData(filtered);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${filteredData.length})`}
          description="Manage products for your business"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div className="flex items-center justify-end">
        <FilterProduct
          onFilterChange={handleFiltersChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={filteredData}
        searchableColumns={["name", "sku"]}
      />
    </>
  );
};
