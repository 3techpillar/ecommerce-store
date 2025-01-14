"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ShippingColumn = {
  id: string;
  code: string;
  type: string;
  charges: number;
  isActive: boolean;
};

export const columns: ColumnDef<ShippingColumn>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "charges",
    header: "Charges",
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
