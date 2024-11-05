"use client";

import useAuthStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/sign-in");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return <div>Welcome to the Admin Dashboard, {user?.username}!</div>;
}
