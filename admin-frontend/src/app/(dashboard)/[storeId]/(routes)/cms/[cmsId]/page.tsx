"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { CmsForm } from "./components/cms-form";
import { Button } from "@/components/ui/button";

const CmsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCms = async () => {
    try {
      if (params.cmsId === "new") {
        setCms(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/v1/cms/get-by-id/${params.cmsId}`);
      const fetchedCms = response.data.cms;

      if (fetchedCms) {
        setCms(fetchedCms);
      } else {
        setCms(null);
      }
    } catch (err) {
      console.error("Error fetching cms:", err);
      setCms(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCms();
  }, [params.cmsId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>
      </div>
    );
  }

  if (!cms && params.cmsId !== "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h1 className="text-2xl font-bold">Cms page not found</h1>
          <p>The requested CMS page could not be found.</p>
          <Button onClick={() => router.push("/cms")}>Go back to CMS</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CmsForm initialData={cms} />
      </div>
    </div>
  );
};

export default CmsPage;
