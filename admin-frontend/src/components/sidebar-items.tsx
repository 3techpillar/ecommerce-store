"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  House,
  Image as LucideImg,
  Network,
  Package,
  TicketCheck,
  Settings,
  ChevronDown,
  LayoutTemplate,
  Truck,
  ShoppingCart,
  Feather,
  NotebookText,
  ContainerIcon,
  ChartNoAxesCombined,
} from "lucide-react";

import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

const SidebarItems = () => {
  const params = useParams();

  const sidebarItems = [
    {
      title: "Overview",
      href: `/${params.storeId}`,
      icon: <LayoutTemplate size={18} />,
    },
    {
      title: "Home",
      icon: <House size={18} />,
      items: [
        {
          title: "Banners",
          href: `/${params.storeId}/banners`,
          icon: <LucideImg size={18} />,
        },
        {
          title: "Featured Products",
          href: `/${params.storeId}/featured`,
          icon: <Feather size={18} />,
        },
        {
          title: "Category Products",
          href: `/${params.storeId}/product-category`,
          icon: <Feather size={18} />,
        },
      ],
    },
    {
      title: "Brands",
      href: `/${params.storeId}/brand`,
      icon: <Network size={18} />,
    },
    {
      title: "Categories",
      href: `/${params.storeId}/categories`,
      icon: <Network size={18} />,
    },
    {
      title: "Products",
      href: `/${params.storeId}/products`,
      icon: <Package size={18} />,
    },
    {
      title: "Coupons",
      href: `/${params.storeId}/coupon`,
      icon: <TicketCheck size={18} />,
    },
    {
      title: "Orders",
      href: `/${params.storeId}/orders`,
      icon: <Truck size={18} />,
    },
    {
      title: "Sales Order",
      href: `/${params.storeId}/sales-order`,
      icon: <Truck size={18} />,
    },
    {
      title: "Carts",
      href: `/${params.storeId}/carts`,
      icon: <ShoppingCart size={18} />,
    },
    {
      title: "Shipping",
      href: `/${params.storeId}/shipping`,
      icon: <ContainerIcon size={18} />,
    },
    {
      title: "CMS Pages",
      href: `/${params.storeId}/cms`,
      icon: <NotebookText size={18} />,
    },
    {
      title: "Analytics",
      href: `/${params.storeId}/analytics`,
      icon: <ChartNoAxesCombined size={18} />,
    },
    {
      title: "Settings",
      href: `/${params.storeId}/settings`,
      icon: <Settings size={18} />,
    },
  ];

  return (
    <SidebarGroupContent className="mt-5">
      <SidebarMenu>
        {sidebarItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items ? (
              <Collapsible className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <Link href={subItem.href}>
                            {subItem.icon}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

export default SidebarItems;
