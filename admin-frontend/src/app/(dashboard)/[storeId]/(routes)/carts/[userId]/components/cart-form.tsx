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
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Heading
            title={`${initialData.user.name} Cart`}
            description={initialData._id}
          />
          <div className="flex items-center justify-center gap-2">
            <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md">
              <span className="font-semibold">Costomer Name:</span>{" "}
              {initialData.user.name}
            </div>
            <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md">
              <span className="font-semibold">Phone No: </span>{" "}
              {initialData.user.phone}
            </div>
            <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md">
              <span className="font-semibold">Email: </span>{" "}
              {initialData.user.email}
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <Heading title="Items Details" description="Cart items details" />

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
          {initialData.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <img
                  src={item.product?.thumbnail}
                  alt={item.product?.name}
                  className="w-12 h-12 object-cover"
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
          <TableCell>Subtotal</TableCell>
          <TableCell>{initialData.totalPrice}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell>Discount</TableCell>
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
                <TableCell>Coupon Discount</TableCell>
                <TableCell className="">
                  -{initialData.appliedCoupon.discount.toFixed(2)}
                </TableCell>
              </TableRow>
            )}
            {initialData.appliedCoupon.code && (
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell>Coupon Code</TableCell>
                <TableCell className="">
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
    </>
  );
};
