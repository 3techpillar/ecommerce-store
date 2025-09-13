"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { CmsColumn, columns } from "./columns";

interface CmsClientProps {
  data: CmsColumn[];
}

export const CategoryClient: React.FC<CmsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Heading
          title={`CMS Pages (${data.length})`}
          description="Manage CMS Pages for your business"
        />
        <Button onClick={() => router.push(`/${params.storeId}/cms/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div className="overflow-x-auto">
      <DataTable columns={columns} data={data} searchableColumns={["name"]} />
      </div>
      </div>
    </>
  );
};
