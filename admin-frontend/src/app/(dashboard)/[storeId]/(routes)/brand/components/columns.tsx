"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type BrandColumn = {
  id: string;
  brandName: string;
};

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: "brandName",
    header: "Brand Name",
  },
  {
    id: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Action",
  },
];
