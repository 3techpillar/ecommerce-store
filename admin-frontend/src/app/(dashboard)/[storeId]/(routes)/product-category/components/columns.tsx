"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CategoryProductColumn = {
  id: string;
  title: string;
  subTitle: string;
  category: string;
  isActive: string;
};

export const columns: ColumnDef<CategoryProductColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subTitle",
    header: "Subtitle",
  },
  {
    accessorKey: "category",
    header: "Category",
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
