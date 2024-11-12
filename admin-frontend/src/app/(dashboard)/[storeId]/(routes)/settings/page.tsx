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
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!store) {
    return null;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingPage;
