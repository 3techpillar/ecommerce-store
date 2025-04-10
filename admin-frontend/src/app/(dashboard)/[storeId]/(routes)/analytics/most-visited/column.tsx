"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type MostVisitedProductsColumn = {
  id: string;
  thumbnail: string;
  name: string;
  visitCount: number;
};

export const columns: ColumnDef<MostVisitedProductsColumn>[] = [
  {
    id: "icon",
    cell: ({ row }) => (
      <div className="relative w-8 h-8">
        <Image
          src={row.original.thumbnail}
          alt={row.original.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
    ),
    header: "Image",
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "visitCount",
    header: "Visits",
  },
];
