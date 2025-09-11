"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { SpecialCategoryColumn, SpecialColumn } from "./specialColumn";

interface CategoryClientProps {
  data: SpecialCategoryColumn[];
}

export const SpecialClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Heading
          title={`Special categories (${data.length})`}
          description="Manage special categories for your business"
        />
        <Button
          onClick={() =>
            router.push(`/${params.storeId}/categories/special/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={SpecialColumn}
        data={data}
        searchableColumns={["name"]}
      />
    </>
  );
};
