"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  _id: string;
  name: string;
  totalPriceAfterDiscount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "_id",
    header: "Order ID",
  },
  {
    accessorKey: "name",
    header: "Costomer name",
  },
  {
    accessorKey: "totalPriceAfterDiscount",
    header: "Price",
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment status",
  },
  {
    accessorKey: "orderStatus",
    header: "Order status",
  },

  {
    accessorKey: "createdAt",
    header: "Order date",
  },
  {
    id: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Action",
  },
];
