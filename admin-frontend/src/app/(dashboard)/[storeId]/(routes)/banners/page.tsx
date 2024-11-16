"use client";

import { useEffect, useState } from "react";

import { CategoryClient } from "./components/client";
import { BannerColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const params = useParams();

  const fetchBanners = async () => {
    try {
      const response = await api.get(`/v1/banner/all/${params.storeId}`);
      console.log("fetch banners:", response.data.banners);

      setBanners(response.data.banners);
    } catch (error) {
      console.log("Error while fetching category", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const formattedBanners: BannerColumn[] = banners.map((item) => ({
    id: item._id,
    url: item.images[0].url,
    altText: item.images[0].altText,
    title: item.title,
    bannerPosition: item.bannerPosition,
    isVisible: item.isVisible,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedBanners} />
      </div>
    </div>
  );
};

export default Banner;
