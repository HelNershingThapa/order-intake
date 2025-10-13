"use client";

import React from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { createVendor } from "../../actions";
import { useRouter } from "next/navigation";

const vendorSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().min(2).max(100),
  password: z.string().min(5).max(300),
  confirm_password: z.string(),
  delivery_address: z.string(),
});

export type VendorFormData = z.infer<typeof vendorSchema>;

export default function CreateVendorFormClient() {
  const router = useRouter();
  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: VendorFormData) => createVendor(data),
    onSuccess: (data) => {
      toast.success("Vendor created successfully!", {
        description: `Vendor ID: ${data.vendor_id} created}`,
        duration: 5000,
      });
      router.push("/vendors");
    },
    onError: (error) => {
      toast.error("Failed to create vendor", {
        description: <div className="whitespace-pre-line">{error.message}</div>,
        duration: 8000,
      });
    },
  });

  function onSubmit(values: VendorFormData) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vendor Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="delivery_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Pickup Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 animate-spin" />}
              Create
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
