"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, CartColumn } from "./columns";

interface CartClientProps {
  data: CartColumn[];
}

export const CartClient: React.FC<CartClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Carts (${data.length})`}
          description="Manage carts for your business"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchableColumns={["name"]} />
    </>
  );
};
