"use client";

import { useEffect, useState } from "react";

import { CategoryClient } from "./components/client";
import { CmsColumn } from "./components/columns";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

const CMS = () => {
  const [cms, setCms] = useState([]);
  const params = useParams();

  const fetchCms = async () => {
    try {
      const response = await api.get(`/v1/cms/get-all/${params.storeId}`);

      setCms(response.data.cms);
    } catch (error) {
      console.log("Error while fetching category", error);
    }
  };

  useEffect(() => {
    fetchCms();
  }, []);

  const formattedBanners: CmsColumn[] = cms.map((item) => ({
    id: item._id,
    image: item.image,
    title: item.title,
    isActive: item.isActive,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedBanners} />
      </div>
    </div>
  );
};

export default CMS;
