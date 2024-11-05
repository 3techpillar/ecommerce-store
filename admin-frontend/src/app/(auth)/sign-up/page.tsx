"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/userStore";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setCredentials, setError } = useAuthStore();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await api.post("v1/auth/signup", values);
      const { user, token } = response.data;
      setCredentials(user, token);

      toast.success("Signup successful");
      router.replace("/");
    } catch (error) {
      console.error("Signup error:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Signup failed: ${error.response.data.message || "Please try again."}`
        );
      } else {
        setError("Signup failed. Please try again.");
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create Admin Account
        </CardTitle>
        <CardDescription className="text-neutral-600">
          Sign up to start managing your store.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </Form>
        <CardDescription className="text-neutral-600 text-center mt-2">
          Already have an account{"  "}
          <Link href={"/sign-in"} className="text-black font-semibold">
            Sign in
          </Link>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
