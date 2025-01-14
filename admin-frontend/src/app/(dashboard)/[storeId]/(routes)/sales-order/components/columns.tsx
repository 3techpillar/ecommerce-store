"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

export type SalesOrderColumn = {
  _id: string;
  thumbnail: string;
  name: string;
  totalPrice: number;
  quantity: string;
  orderId: string;
};

export const columns: ColumnDef<SalesOrderColumn>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="w-[400px] line-clamp-1">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    id: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Action",
  },
];
