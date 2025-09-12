"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { FeaturedProductColumn, columns } from "./columns";

interface ProductClientProps {
  data: FeaturedProductColumn[];
}

export const FeaturedProductClient: React.FC<ProductClientProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Heading
          title={`Featured Products (${data.length})`}
          description="Manage featured products for your business"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/featured/new`)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      {/* Table Section */}
      <div className="overflow-x-auto bg-gray-50 rounded-md p-2">
        <DataTable
          columns={columns}
          data={data}
          searchableColumns={["title"]}
        />
      </div>
    </div>
  );
};
