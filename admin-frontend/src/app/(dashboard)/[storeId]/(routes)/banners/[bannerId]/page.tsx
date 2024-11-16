"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { BannerForm } from "./components/billboard-form";
import { Button } from "@/components/ui/button";

const BannerPage = () => {
  const params = useParams();
  const router = useRouter();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBanner = async () => {
    try {
      if (params.bannerId === "new") {
        setBanner(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/v1/banner/${params.bannerId}`);
      const fetchedBanner = response.data.banner;

      if (fetchedBanner) {
        setBanner(fetchedBanner);
      } else {
        setBanner(null);
      }
    } catch (err) {
      console.error("Error fetching category:", err);
      setBanner(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [params.bannerId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!banner && params.bannerId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Banner not found</h1>
          <p>The requested banner could not be found.</p>
          <Button onClick={() => router.push("/categories")}>
            Go back to banner
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerForm initialData={banner} />
      </div>
    </div>
  );
};

export default BannerPage;
