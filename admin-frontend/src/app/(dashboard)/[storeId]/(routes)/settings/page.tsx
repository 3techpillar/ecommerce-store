"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import useAuthStore from "@/store/userStore";
import api from "@/lib/axios";
import { SettingForm } from "./components/setting-form";

interface Store {
  id: string;
  name: string;
}

const SettingPage = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchStore = async () => {
      if (!user?._id || !params.storeId) {
        router.push("/sign-in");
        return;
      }

      try {
        const response = await api.get<Store>(
          `/v1/setting/get-store-by-userid/${user._id}/${params.storeId}`
        );
        setStore(response.data);
      } catch (err) {
        console.error("Error fetching store:", err);
        setError("Failed to fetch store data");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [user, params.storeId, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">Loading...</div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-full min-h-[300px] text-red-500">{error}</div>;
  }

  if (!store) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-4xl">
        <SettingForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingPage;
