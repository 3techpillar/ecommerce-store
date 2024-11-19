"use client";

import { useEffect, useState } from "react";

import { FeaturedProductClient } from "./components/client";
import { FeaturedProductColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

const Categories = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const params = useParams();

  console.log(featuredProducts);

  const fetchproducts = async () => {
    try {
      const response = await api.get(`/v1/featured/get-all/${params.storeId}`);

      setFeaturedProducts(response.data);
    } catch (error) {
      console.log("Error while fetching featured products", error);
    }
  };

  useEffect(() => {
    fetchproducts();
  }, []);

  const formattedFeaturedProducts: FeaturedProductColumn[] =
    featuredProducts.map((item) => ({
      id: item._id,
      title: item.title,
      subTitle: item.subTitle,
      isActive: item.isActive,
    }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FeaturedProductClient data={formattedFeaturedProducts} />
      </div>
    </div>
  );
};

export default Categories;
