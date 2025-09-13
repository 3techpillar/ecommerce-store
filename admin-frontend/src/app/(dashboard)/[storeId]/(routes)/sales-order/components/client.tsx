"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, SalesOrderColumn } from "./columns";

interface OrderClientProps {
  data: SalesOrderColumn[];
}

export const SalesOrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
    <div className="p-2 sm:p-6 md:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Heading
          title={`Sales Order Items (${data.length})`}
          description="Manage sales order items for your business"
        />
      </div>
      <Separator />
      <div className="overflow-x-auto">
      <DataTable columns={columns} data={data} searchableColumns={["_id"]} />
    </div>
    </div>
    </>
  );
};
