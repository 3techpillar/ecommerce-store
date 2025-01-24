"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { BrandColumn, columns } from "./columns";
import React from "react";

interface BrandClientProps {
  data: BrandColumn[];
}

export const BrandClient: React.FC<BrandClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Brand (${data.length})`}
          description="Manage brand for your business"
        />
        <Button onClick={() => router.push(`/${params.storeId}/brand/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={data}
        searchableColumns={["brandName"]}
      />
    </>
  );
};
