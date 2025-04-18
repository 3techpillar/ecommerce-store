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
import { useEffect, useState } from "react";
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
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  title: z.string().min(1, "Category name is required"),
  subTitle: z.string().optional(),
  selectedProducts: z.array(z.string()).min(1, "Select at least one product"),
  isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: CategoryFormValues | null;
}

export const SpecialCategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/v1/product/${params.storeId}`);

      const mappedProducts = response.data.map((product) => ({
        value: product._id,
        label: product.name || "Unnamed Product",
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error while fetching products", error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params.storeId]);

  const title = initialData
    ? "Edit Special Category"
    : "Create Special Category";
  const description = initialData
    ? "Edit special category details"
    : "Add a new special category";
  const toastMessage = initialData
    ? "Special Category updated."
    : "Special Category created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      subTitle: initialData?.subTitle || "",
      isActive: initialData?.isActive ?? true,
      selectedProducts: initialData?.selectedProducts || [],
    },
  });

  const onSubmit = async (values: CategoryFormProps) => {
    try {
      setLoading(true);
      if (initialData) {
        await api.put(
          `/v1/special-category/update/${params.specialId}`,
          values
        );
      } else {
        await api.post(`/v1/special-category/create/${params.storeId}`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
      await api.delete(`/v1/special-category/delete/${params.specialId}`);
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Featured list deleted.");
    } catch (error) {
      toast.error("Failed to delete the Featured list.");
      console.error("Something went wrong!", error);
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Enter title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Enter subtitle"
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
                <FormItem>
                  <FormLabel>Is Active</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectedProducts"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Select Products</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={products}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select products"
                      maxCount={5}
                      className="w-full"
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
      <Separator />
    </>
  );
};
