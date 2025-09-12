"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useAuthStore from "@/store/userStore";

const formSchema = z.object({
  orderStatus: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
  comment: z.string().min(1, "Comment is required"),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  initialData: any;
}

const Para = ({ title, value }) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  );
};

export const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
  const { user } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const renderAddress = (address: any) => {
    if (!address?.street) return null;
    return (
      <div className="text-sm text-gray-600 leading-relaxed">
        {`${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.zipCode}`}
      </div>
    );
  };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
         ...initialData,
       }
      : {
         comment: "",
         orderStatus: "",
          paymentStatus: "",
         },
  });

  const onSubmit = async (values: OrderFormValues) => {
    try {
      setLoading(true);
      const payload = { 
        ...values, 
        writtenBy: user?.username || "Admin"
       };
      if (initialData) {
        await api.put(`/v1/order/status/${params.orderId}`, payload);
      }
      router.refresh();
      // router.push(`/${params.storeId}/order`);
      toast.success("Order updated successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Order Header */}
      <div className="p-5 bg-white rounded-xl shadow-sm">
        <Heading title="Order Summary" description={`Order ID: ${initialData._id}`} />
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            Placed: {format(initialData.createdAt, "dd MMM yyyy, h:mm a")}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Status: {initialData.orderStatus}
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
            Payment: {initialData.paymentStatus}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Customer Info</h2>
          <Para title="Name" value={initialData.user.name} />
          <Para title="Email" value={initialData.user.email} />
          <Para title="Phone" value={initialData.user.phone} />
          <Para title="Payment Method" value={initialData.paymentMethod} />
        </div>
        <div className="p-5 bg-white rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
          {renderAddress(initialData.shippingAddress)}
        </div>
        <div className="p-5 bg-white rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Billing Address</h2>
          {renderAddress(initialData.shippingAddress)}
        </div>
      </div>
      <div className="p-5 bg-white rounded-xl shadow-sm">
        <Heading title="Order Items" description="List of purchased products" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.items.map((item, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
                <TableCell>
                  <img
                    src={item.product?.thumbnail}
                    alt={item.product?.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>{item.product?.name}</TableCell>
                <TableCell className="text-right">₹{item.price}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">₹{item.totalPrice}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell className="text-right font-semibold">Subtotal</TableCell>
              <TableCell className="text-right">₹{initialData.totalPrice}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell className="text-right font-semibold">Discount</TableCell>
              <TableCell className="text-right text-red-500">
                -₹{initialData.discount.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell className="text-right font-bold">Total</TableCell>
              <TableCell className="text-right font-bold">
                ₹{initialData.totalPriceAfterDiscount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Order History */}
      <div className="p-5 bg-white rounded-xl shadow-sm">
        <Heading title="Order History" description="Track past updates" />
        <div className="relative border-l-2 border-gray-200 ml-3 mt-6">
          {initialData.history.map((item) => (
            <div key={item._id} className="ml-4 mb-6 relative">
              <div className="absolute -left-[11px] w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              <p className="text-xs text-gray-500">
                {format(new Date(item.timestamp), "dd MMM yyyy, hh:mm a")}
              </p>
              <p className="font-medium">
                Order: {item.orderStatusLog} | Payment: {item.paymentStatusLog}
              </p>
              {item.comment && (
                <p className="text-sm text-gray-600">💬 {item.comment}</p>
              )}
              {item.writtenBy && (
                <p className="text-xs text-gray-500">By {item.writtenBy}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-white rounded-xl shadow-sm">
        <Heading title="Update Order" description="Change status & add comments" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
          >
            <FormField
              control={form.control}
              name="orderStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Order Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter comment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-full">
              <Button
                disabled={loading}
                className="w-full md:w-auto"
                type="submit"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
