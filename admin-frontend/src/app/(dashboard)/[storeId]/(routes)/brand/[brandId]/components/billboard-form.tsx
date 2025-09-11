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

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
});

type BrandFormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
  initialData: BrandFormValues | null;
}

export const BrandForm: React.FC<BrandFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Brand" : "Create Brand";
  const description = initialData ? "Edit brand details" : "Add a new brand";
  const toastMessage = initialData ? "Brand updated." : "Brand created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      brandName: "",
    },
  });

  const onSubmit = async (values: BrandFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await api.put(`/v1/brand/update/${params.brandId}`, values);
      } else {
        await api.post(`/v1/brand/create/${params.storeId}`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/brand`);
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
      await api.delete(`/v1/brand/delete/${params.brandId}`);
      router.refresh();
      router.push(`/${params.storeId}/brand`);
      toast.success("Brand deleted.");
    } catch (error) {
      toast.error("Failed to delete the brand.");
      console.log("Something went wrong!", error);
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
      <div className="flex items-center justify-between">
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
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand name Ranvijay Singh</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Enter brand name title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
