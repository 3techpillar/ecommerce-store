"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SpecialCellAction } from "./special-cell-action";

export type SpecialCategoryColumn = {
  id: string;
  title: string;
  subTitle: string;
  isActive: boolean;
};

export const SpecialColumn: ColumnDef<SpecialCategoryColumn>[] = [
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
    cell: ({ row }) => <SpecialCellAction data={row.original} />,
    header: "Action",
  },
];
