"use client";

import { useEffect, useState } from "react";

import { BrandClient } from "./components/client";
import { BrandColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const params = useParams();

  const fetchBrands = async () => {
    try {
      const response = await api.get(`/v1/brand/all/${params.storeId}`);
      console.log("fetch banners:", response.data.brands);

      setBrands(response.data.brands);
    } catch (error) {
      console.log("Error while fetching brands", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const formattedBrands: BrandColumn[] = brands.map((item) => ({
    id: item._id,
    brandName: item.brandName,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 space-y-6 sm:p-6 md:p-8 pt-6">
        <BrandClient data={formattedBrands} />
      </div>
    </div>
  );
};

export default Brand;
