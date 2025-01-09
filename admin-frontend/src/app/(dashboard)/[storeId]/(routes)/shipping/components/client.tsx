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
      <div className="flex items-center justify-between">
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
      <DataTable columns={columns} data={data} searchableColumns={["code"]} />
    </>
  );
};
