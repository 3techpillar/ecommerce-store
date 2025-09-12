"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, OrderColumn } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
     <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your business"
        />
        {/* <Button onClick={() => router.push(`/${params.storeId}/orders/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button> */}
      </div>
     <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
       <Separator />
      <DataTable columns={columns} data={data} searchableColumns={["_id"]} />
     </div>
     </div>
    </>
  );
};
