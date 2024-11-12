"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBusinessModal } from "@/hooks/use-business-modal";
import useAuthStore from "@/store/userStore";
import api from "@/lib/axios";

export default function StorePage() {
  const { user, isLoggedIn } = useAuthStore();
  const router = useRouter();
  const { onOpen } = useBusinessModal();

  useEffect(() => {
    const checkAndHandleStore = async () => {
      if (!isLoggedIn || !user) {
        return;
      }

      try {
        const response = await api.get(
          `/v1/setting/get-first-store/${user._id}`
        );
        const store = response.data;

        if (store) {
          router.push(`/${store._id}`);
        } else {
          onOpen();
        }
      } catch (error) {
        console.error("Error checking store:", error);
        onOpen();
      }
    };

    checkAndHandleStore();
  }, [isLoggedIn, user, router, onOpen]);

  return null;
}
