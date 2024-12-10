"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CartColumn = {
  _id: string;
  user: string;
  name: string;
  email: number;
  phone: string;
  products: string;
  netPrice: number;
};

export const columns: ColumnDef<CartColumn>[] = [
  {
    accessorKey: "name",
    header: "Costomer name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone No",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "netPrice",
    header: "Total Price",
  },
  {
    id: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Action",
  },
];
