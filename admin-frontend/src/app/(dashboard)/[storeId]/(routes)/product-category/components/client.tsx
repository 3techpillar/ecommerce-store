"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { CategoryProductColumn, columns } from "./columns";

interface ProductClientProps {
  data: CategoryProductColumn[];
}

export const CategoryProductClient: React.FC<ProductClientProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Category Products (${data.length})`}
          description="Manage category products for your business"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/product-category/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchableColumns={["title"]} />
    </>
  );
};
