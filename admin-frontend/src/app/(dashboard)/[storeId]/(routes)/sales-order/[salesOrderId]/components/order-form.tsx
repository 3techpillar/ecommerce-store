"use client";

import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface OrderFormProps {
  initialData: any;
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
  console.log(initialData);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Heading title="Sales Order Item" description={initialData.orderId} />
          <div className="flex items-center justify-center gap-2">
            <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md">
              <span className="font-semibold">Placed on:</span>{" "}
              {format(initialData.createdAt, "MMMM do yyyy, h:mm a")}
            </div>
          </div>
        </div>
      </div>
      <Separator />

      <Separator />

      <Heading title="Items Details" description="Order items details" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Image
                src={initialData.product.thumbnail}
                alt={initialData.product.name}
                className="object-cover"
                width={50}
                height={50}
              />
            </TableCell>
            <TableCell>{initialData.product.name}</TableCell>
            <TableCell>{initialData.price}</TableCell>
            <TableCell>{initialData.quantity}</TableCell>
            <TableCell>{initialData.totalPrice}</TableCell>
          </TableRow>
        </TableBody>
        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell>Subtotal</TableCell>
          <TableCell>{initialData.totalPrice}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell>Discount</TableCell>
          <TableCell className="">
            -{initialData.totalProductDiscount.toFixed(2)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="font-bold">{initialData.totalPrice}</TableCell>
        </TableRow>
      </Table>
    </>
  );
};
