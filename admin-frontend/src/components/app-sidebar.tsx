"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import api from "@/lib/axios";

import useAuthStore from "@/store/userStore";

import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import StoreSwitcher from "./store-switcher";
import SidebarItems from "./sidebar-items";
import SideBarFooter from "./sidebar-footer";

export function AppSidebar() {
  const { isLoggedIn, user } = useAuthStore();
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
  }, [isLoggedIn, router, user]);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <StoreSwitcher items={stores} />
          <SidebarItems />
        </SidebarGroup>
      </SidebarContent>
      <SideBarFooter />
    </Sidebar>
  );
}
