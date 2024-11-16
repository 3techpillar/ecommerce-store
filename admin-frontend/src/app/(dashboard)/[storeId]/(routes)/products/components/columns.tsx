"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

export type ProductColumn = {
  id: string;
  thumbnail: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  categoryId: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    id: "thumbnail",
    cell: ({ row }) => (
      <div className="relative w-12 h-12">
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
    accessorKey: "sku",
    header: "Sku",
    cell: ({ row }) => {
      return <div className="w-[200px] line-clamp-1">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="w-[200px] line-clamp-1">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Action",
  },
];
