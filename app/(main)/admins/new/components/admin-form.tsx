"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { createAdmin } from "../actions"

const vendorSchema = z
  .object({
    username: z.string().min(3).max(100),
    email: z.string().min(2).max(100),
    password: z.string().min(5).max(300),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

export type AdminFormData = z.infer<typeof vendorSchema>

export function CreateAdminForm() {
  const form = useForm<AdminFormData>({
    resolver: zodResolver(vendorSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: AdminFormData) => createAdmin(data),
    onSuccess: (data) => {
      toast.success("Admin created successfully!", {
        description: `Admin ID: ${data.user_id} created}`,
        duration: 5000,
      })
    },
    onError: (error) => {
      toast.error("Failed to create admin", {
        description: <div className="whitespace-pre-line">{error.message}</div>,
        duration: 8000,
      })
    },
  })

  function onSubmit(values: AdminFormData) {
    mutation.mutate(values)
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 animate-spin" />}
              Create
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  )
}
