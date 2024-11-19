"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type FeaturedProductColumn = {
  id: string;
  title: string;
  subTitle: string;
  isActive: string;
};

export const columns: ColumnDef<FeaturedProductColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subTitle",
    header: "Subtitle",
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
