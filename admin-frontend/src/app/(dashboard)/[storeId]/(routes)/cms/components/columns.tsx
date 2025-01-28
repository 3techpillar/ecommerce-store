"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

export type CmsColumn = {
  id: string;
  image: string;
  title: string;
  isActive: boolean;
};

export const columns: ColumnDef<CmsColumn>[] = [
  {
    id: "icon",
    cell: ({ row }) => (
      <div className="relative w-8 h-8">
        <Image
          src={row.original.image}
          alt={row.original.title}
          fill
          className="object-cover rounded-md"
        />
      </div>
    ),
    header: "Image",
  },
  {
    accessorKey: "title",
    header: "Title",
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
