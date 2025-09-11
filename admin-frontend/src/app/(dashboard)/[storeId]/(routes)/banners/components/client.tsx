"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { BannerColumn, columns } from "./columns";
import React from "react";

interface BannerClientProps {
  data: BannerColumn[];
}

export const CategoryClient: React.FC<BannerClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="p-4 space-y-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center  items-center sm:justify-between gap-4">
        <Heading
          title={`Banner (${data.length})`}
          description="Manage banners for your business"
        />
        <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white transition-colors" onClick={() => router.push(`/${params.storeId}/banners/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow ring-1 ring-gray-200">
        <Separator />
      <DataTable columns={columns} data={data} searchableColumns={["name"]} />
      </div>
    </div>
  );
};
