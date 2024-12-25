"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

export type BannerColumn = {
  id: string;
  image: string;
  title: string;
  bannerPosition: string;
  isVisible: boolean;
};

export const columns: ColumnDef<BannerColumn>[] = [
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
    accessorKey: "bannerPosition",
    header: "Position",
  },
  {
    accessorKey: "isVisible",
    header: "Visibility",
  },
  {
    id: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Action",
  },
];
