"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CouponColumn = {
  id: string;
  code: string;
  expires: string;
  discountType: string;
  discount: number;
  minPrice: number;
  isActive: boolean;
};

export const columns: ColumnDef<CouponColumn>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "expires",
    header: "Expires",
  },
  {
    accessorKey: "discountType",
    header: "Discount type",
  },
  {
    accessorKey: "discount",
    header: "Discount",
  },
  {
    accessorKey: "minPrice",
    header: "Min price",
  },
  {
    accessorKey: "isActive",
    header: "Active",
  },
  {
    id: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Action",
  },
];
