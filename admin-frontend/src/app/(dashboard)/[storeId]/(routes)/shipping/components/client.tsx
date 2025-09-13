"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, ShippingColumn } from "./columns";

interface ShippingClientProps {
  data: ShippingColumn[];
}

export const ShippingClient: React.FC<ShippingClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
   <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Heading
          title={`Shipping charges (${data.length})`}
          description="Manage shipping charges for your business"
        />
        <Button onClick={() => router.push(`/${params.storeId}/shipping/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div className="overflow-x-auto">
      <DataTable columns={columns} data={data} searchableColumns={["code"]} />
   </div>
   </div>
    </>
  );
};
