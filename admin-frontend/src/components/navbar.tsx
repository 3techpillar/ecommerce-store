"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import useAuthStore from "@/store/userStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import api from "@/lib/axios";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();

  const [stores, setStores] = useState([]);

  useEffect(() => {
    if (isLoggedIn && user) {
      const fetchBusiness = async () => {
        try {
          const response = await api.get(
            `/v1/setting/get-all-store/${user._id}`
          );
          const data = response.data;
          setStores(data);
        } catch (error) {
          console.log("error while fetching business", error);
        }
      };

      fetchBusiness();
    } else if (!isLoggedIn) {
      router.push("/sign-in");
    }
  }, [isLoggedIn, router]);

  const handleSignout = async () => {
    try {
      await api.post("/v1/auth/signout");
      logout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign-out failed", error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-8">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full overflow-hidden"
              >
                <Image src={""} alt={user?.username} width={40} height={40} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="p-4 bg-white shadow-xl rounded-lg"
            >
              {/* User Info */}
              <div className="flex gap-2 p-2">
                <Image
                  src={""}
                  alt={user?.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-bold capitalize">{`${user?.username}`}</p>
                  <p className="text-xs text-gray-700">{user?.email}</p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleSignout}>
                <span className="flex items-center w-full text-sm mt-2">
                  Sign out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
