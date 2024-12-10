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
    <div className="flex items-center justify-between mb-3">
      <p className="text-base font-semibold">{title}</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  );
};

export const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
  const { user } = useAuthStore();

  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  console.log(initialData);

  const renderAddress = (address: any) => {
    if (!address?.street) return null;

    return (
      <div className="text-base text-gray-600">{`${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.zipCode}`}</div>
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
        writtenBy: user?.username || "Admin",
      };

      if (initialData) {
        await api.put(`/v1/order/status/${params.orderId}`, payload);
      }
      router.refresh();
      // router.push(`/${params.storeId}/order`);
      toast.success("Order updated");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Heading title="Order" description={initialData._id} />
          <div className="flex items-center justify-center gap-2">
            <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md">
              <span className="font-semibold">Placed on:</span>{" "}
              {format(initialData.createdAt, "dd-mm-yyyy, h:mm a")}
            </div>
            <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md">
              <span className="font-semibold">Order status: </span>{" "}
              {initialData.orderStatus}
            </div>
            <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md">
              <span className="font-semibold">Payment status: </span>{" "}
              {initialData.paymentStatus}
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <Heading title="Basic Details" description="Basic order details" />

      <div className="grid grid-cols-3 gap-8">
        <div className="border-2 border-gray-200 rounded-md p-5">
          <h1 className=" uppercase text-xl font-semibold">Costomer & Order</h1>
          <Para title="Name" value={initialData.user.name} />
          <Para title="Email" value={initialData.user?.email} />
          <Para title="Phone" value={initialData.user?.phone} />
          <Para title="Delivery method" value={initialData.paymentMethod} />
        </div>
        <div className="border-2 border-gray-200 rounded-md p-5">
          <h1 className=" uppercase text-xl font-semibold">Shipping Address</h1>
          {renderAddress(initialData.shippingAddress)}
        </div>
        <div className="border-2 border-gray-200 rounded-md p-5">
          <h1 className=" uppercase text-xl font-semibold">Billing Address</h1>
          {renderAddress(initialData.shippingAddress)}
        </div>
      </div>

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
      </Table>

      <Heading
        title="Additional information"
        description="Update the additional info"
      />

      <ul className="space-y-3">
        {initialData.history.map((item) => (
          <li key={item._id} className="bg-white shadow rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Order status:{" "}
                  <span className="font-bold">{item.orderStatusLog}</span>
                </span>
                <span className="text-sm text-gray-600">
                  Payment status:{" "}
                  <span className="font-semibold">{item.paymentStatusLog}</span>
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(item.timestamp), "dd MMM yyyy, hh:mm a")}
              </span>
            </div>

            {item.comment && (
              <div className="text-sm">
                Comment: <span className="font-semibold">{item.comment}</span>
              </div>
            )}
            {item.writtenBy && (
              <div className="text-sm">
                Edited By:{" "}
                <span className="font-semibold">{item.writtenBy}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="orderStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Order Status" />
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
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};
