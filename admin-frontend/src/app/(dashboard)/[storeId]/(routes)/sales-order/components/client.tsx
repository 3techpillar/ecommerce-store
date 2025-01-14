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
      <div className="flex items-center justify-between">
        <Heading
          title={`Sales Order Items (${data.length})`}
          description="Manage sales order items for your business"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchableColumns={["_id"]} />
    </>
  );
};
