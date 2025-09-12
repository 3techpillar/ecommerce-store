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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  storeId: z.string().min(1, "Store ID is required"),
  title: z.string().min(1, "Featured Products name is required"),
  subTitle: z.string().optional(),
  displayLimit: z.number().min(1).max(12).default(4),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

type CategoryProductFormValues = z.infer<typeof formSchema>;

interface CategoryProductFormProps {
  initialData: CategoryProductFormValues | null;
}

export const CategoryProductForm: React.FC<CategoryProductFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get(
        `/v1/category/get-category-by-storeId/${params.storeId}`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const title = initialData ? "Edit Home Category" : "Create Home Category";
  const description = initialData
    ? "Edit Home Category details"
    : "Add a new Home Category";
  const toastMessage = initialData
    ? "Home Category updated."
    : "Home Category created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeId: params.storeId as string,
      title: initialData?.title || "",
      subTitle: initialData?.subTitle || "",
      category: initialData?.category._id || initialData?.category || "",
      isActive: initialData?.isActive ?? true,
      displayLimit: initialData?.displayLimit || 4,
    },
  });

  const onSubmit = async (values: CategoryProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await api.put(
          `/v1/category-product/update/${params.productCategoryId}`,
          values
        );
      } else {
        await api.post(`/v1/category-product/create/${params.storeId}`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/product-category`);
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
      await api.delete(
        `/v1/category-product/delete/${params.productCategoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/product-category`);
      toast.success("Home category deleted.");
    } catch (error) {
      toast.error("Failed to delete the Home category.");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-white rounded-md shadow">
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
     <div className="p-4 sm:p-6 bg-white rounded-md shadow space-y-6">
       <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="p-4 sm:p-6 bg-white rounded-md shadow space-y-6">
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
              name="displayLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display limit</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      min={1}
                      max={12}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                      placeholder="Enter limit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 lg:col-span-3">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </div>
          <div className="flex justify-end">

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
          </div>
        </form>
      </Form>

     </div>
      <Separator />
    </>
  );
};
