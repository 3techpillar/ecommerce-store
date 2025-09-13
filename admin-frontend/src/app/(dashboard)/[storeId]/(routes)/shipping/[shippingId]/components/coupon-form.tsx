"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
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
import AlertModal from "@/modals/alert-modal";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  type: z.enum(["1-day", "2-day", "normal"]).default("normal"),
  charges: z.number().min(0, "Minimum charges must be a positive number"),
  isActive: z.boolean(),
});

type ShippingFormValues = z.infer<typeof formSchema>;

interface ShippingFormProps {
  initialData: ShippingFormValues | null;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit coupon" : "Create coupon";
  const description = initialData ? "Edit coupon details" : "Add a new coupon";
  const toastMessage = initialData ? "Coupon updated." : "Coupon created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          type: "",
          charges: 0,
          isActive: true,
        },
  });

  const onSubmit = async (values: ShippingFormValues) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        storeId: params.storeId,
      };

      if (initialData) {
        await api.put(`/v1/shipping/${params.shippingId}`, formData);
      } else {
        await api.post(`/v1/shipping/${params.storeId}`, formData);
      }

      router.refresh();
      router.push(`/${params.storeId}/shipping`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/v1/shipping/${params.shippingId}`);
      router.refresh();
      router.push(`/${params.storeId}/shipping`);
      toast.success("Coupon deleted.");
    } catch (error) {
      toast.error("Failed to delete the shipping charges.");
      console.error("Error deleting shipping charges:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="p-4 sm:p-6 md:p-8 space-y-6"></div>
      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name={"type"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipping type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-day">1 Day</SelectItem>
                      <SelectItem value="2-day">2 Day</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="charges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charges</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Charges"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
