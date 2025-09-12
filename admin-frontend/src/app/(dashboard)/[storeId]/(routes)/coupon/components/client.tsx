"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, CouponColumn } from "./columns";

interface CouponClientProps {
  data: CouponColumn[];
}

export const CouponClient: React.FC<CouponClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Heading
          title={`Coupons (${data.length})`}
          description="Manage coupons for your business"
        />
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push(`/${params.storeId}/coupon/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchableColumns={["code"]} />
    </div>
    </>
  );
};
