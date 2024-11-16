import {
  House,
  Image as LucideImg,
  Network,
  Package,
  Package2,
  Settings,
} from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";

const SidebarItems = () => {
  const params = useParams();

  const sidebarItems = [
    {
      href: `/${params.storeId}`,
      title: "Overview",
      icon: <House size={18} />,
    },
    {
      href: `/${params.storeId}/banners`,
      title: "Banners",
      icon: <LucideImg size={18} />,
    },
    {
      href: `/${params.storeId}/featured`,
      title: "Featured Product",
      icon: <Package2 size={18} />,
    },
    {
      href: `/${params.storeId}/categories`,
      title: "Categories",
      icon: <Network size={18} />,
    },
    {
      href: `/${params.storeId}/products`,
      title: "Products",
      icon: <Package size={18} />,
    },
    {
      href: `/${params.storeId}/settings`,
      title: "Settings",
      icon: <Settings size={18} />,
    },
  ];
  return (
    <SidebarGroupContent className="mt-5">
      <SidebarMenu>
        {sidebarItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.href}>
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

export default SidebarItems;
