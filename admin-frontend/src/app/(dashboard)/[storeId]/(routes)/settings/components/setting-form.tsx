"use client";
import * as z from "zod";

import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
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
import AlertModal from "@/modals/alert-modal";
import api from "@/lib/axios";
import ImageUpload from "@/components/ui/image-upload";
import CurrencySelect from "./currencySelect";

interface SettingFormProps {
  initialData: {
    name: string;
  };
}

const formSchema = z.object({
  logoImg: z.string().optional(),
  faviconImg: z.string().optional(),
  name: z.string().min(1),
  currency: z.string().optional(),
  primaryColor: z.string().min(4).regex(/^#/, {
    message: "String must be valid hex code",
  }),
  secondaryColor: z.string().min(4).regex(/^#/, {
    message: "String must be valid hex code",
  }),
  tertiaryColor: z.string().min(4).regex(/^#/, {
    message: "String must be valid hex code",
  }),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: SettingFormValues) => {
    try {
      setLoading(true);
      await api.patch(`/v1/setting/update/${params.storeId}`, values);

      router.refresh();
      toast.success("Business updated.");
    } catch (error) {
      console.log("Error while updating business", error);
      toast.error("Error while updating business");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/v1/setting/${params.storeId}`);
      router.push("/");
      router.refresh();
      toast.success("Business deleted.");
    } catch (error) {
      console.log("Error deleting business", error);
      toast.error("Make sure you first delete active categories and products");
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
        <Heading title="Setting" description="Manage business preferences" />
        <Button
          disabled={loading}
          variant={"destructive"}
          size={"icon"}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
              name="logoImg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faviconImg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FaviconImg Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Store name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <Heading
            title="Currency"
            description="Update the currency settings"
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <CurrencySelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </div>
          <Heading title="Theme" description="Update the theme settings" />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-2">
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="Primary color value"
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-2">
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="Secondary color value"
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tertiaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tertiary Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-2">
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="Tertiary color value"
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
      <Separator />
    </>
  );
};
