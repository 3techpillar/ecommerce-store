"use client";
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

interface CartFormProps {
  initialData: any;
}

export const CartForm: React.FC<CartFormProps> = ({ initialData }) => {
  return (
    <>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md space-y-6">
        <div className="space-y-4">
          <Heading
            title={`${initialData.user.name}'s Cart`}
            description={`Order ID: ${initialData._id}`}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="px-4 py-2 bg-gray-100 text-sm font-medium rounded-md sm:text-base">
              <span className="font-semibold">Customer Name:</span>{" "}
              {initialData.user.name}
            </div>
            <div className="px-4 py-2 bg-gray-100 text-sm font-medium rounded-md sm:text-base">
              <span className="font-semibold">Phone No: </span>{" "}
              {initialData.user.phone}
            </div>
            <div className="px-4 py-2 bg-gray-100 text-sm font-medium rounded-md sm:text-base">
              <span className="font-semibold">Email: </span>{" "}
              {initialData.user.email}
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
      <Heading title="Items Details" description="List of items in the cart" />
<div className="overflow-x-auto">
      <Table className="min-w-full table-auto border border-gray-200 rounded-md">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.items.map((item, index) => (
            <TableRow key={index}  className="hover:bg-gray-50 transition-colors">
              <TableCell>
                <img
                  src={item.product?.thumbnail}
                  alt={item.product?.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
              </TableCell>
              <TableCell>{item.product?.name}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.totalPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell className="font-semibold">Subtotal</TableCell>
          <TableCell>{initialData.totalPrice}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell className="font-semibold">Discount</TableCell>
          <TableCell className="">-{initialData.discount.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="font-bold">
            {initialData.totalPriceAfterDiscount}
          </TableCell>
        </TableRow>

        {initialData.appliedCoupon && (
          <>
            {initialData.appliedCoupon.discount !== undefined && (
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell className="font-semibold">Coupon Discount</TableCell>
                <TableCell className="">
                  -{initialData.appliedCoupon.discount.toFixed(2)}
                </TableCell>
              </TableRow>
            )}
            {initialData.appliedCoupon.code && (
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell className="font-semibold">Coupon Code</TableCell>
                <TableCell>
                  {initialData.appliedCoupon.code}
                </TableCell>
              </TableRow>
            )}
          </>
        )}

        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell className="font-bold">Net price</TableCell>
          <TableCell className="font-bold">{initialData.netPrice}</TableCell>
        </TableRow>
      </Table>
      </div>
      </div>
      </div>
     
    </>
  );
};
