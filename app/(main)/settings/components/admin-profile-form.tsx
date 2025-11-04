"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { PhoneInput } from "@/components/phone-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Admin } from "@/types/miscellaneous"
import { convertLocalTimeToUTC, convertUTCToLocalTime } from "@/utils/timezone"

import { updateAdminProfile } from "../actions"
import { type AdminProfileData, adminProfileSchema } from "./schema"

export function AdminProfileForm({
  admin,
  pickupWindows,
}: {
  admin?: Admin | null
  pickupWindows: Array<AdminProfileData["pickup_windows"][0] & { id: string }>
}) {
  const form = useForm<AdminProfileData>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      contact_name: admin?.contact_name || "",
      contact_phone: admin?.contact_phone || "",
      address: admin?.address || "",
      pickup_windows:
        pickupWindows.length > 0
          ? pickupWindows.map((window) => ({
              ...window,
              start: convertUTCToLocalTime(window.start),
              end: convertUTCToLocalTime(window.end),
            }))
          : [
              {
                name: "",
                description: "",
                start: "",
                end: "",
                is_active: true,
              },
            ],
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: AdminProfileData) => updateAdminProfile(data),
    onSuccess: () => {
      toast.success("Admin profile updated successfully.")
    },
    onError: (error) => {
      toast.error("Failed to update profile. Please try again.", {
        description: error instanceof Error ? error.message : undefined,
      })
    },
  })

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "pickup_windows",
  })

  function onSubmit(values: AdminProfileData) {
    const formattedValues = {
      contact_name: values.contact_name,
      contact_phone: values.contact_phone,
      address: values.address,
      pickup_windows: values.pickup_windows.map((window) => ({
        ...window,
        start: convertLocalTimeToUTC(window.start),
        end: convertLocalTimeToUTC(window.end),
      })),
    }
    mutation.mutate(formattedValues)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Enter contact number. E.g., 9801234569"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 123 Main Street, Kathmandu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Pickup Time Windows</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  name: "",
                  description: "",
                  start: "",
                  end: "",
                  is_active: true,
                })
              }
            >
              <Plus className="size-4" />
              Add Window
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle>
                  <Badge variant="secondary">Window {index + 1}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`pickup_windows.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Morning Pickup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pickup_windows.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Early morning pickup window"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`pickup_windows.${index}.start`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`pickup_windows.${index}.end`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`pickup_windows.${index}.is_active`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Enable this time window for pickups
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <Button size="sm" type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          {mutation.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  )
}
