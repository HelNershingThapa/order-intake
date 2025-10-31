"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { BookUser } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CurrentUser } from "@/types/miscellaneous"
import { convertUTCToLocalTime } from "@/utils/timezone"

import { TimeWindow } from "../../settings/components/schema"
import { updateVendor } from "../actions"
import { PickupLocationMap } from "./pickup-location-map"

const vendorSchema = z.object({
  contact_name: z.string().min(2).max(100),
  contact_phone: z
    .string()
    .regex(
      /^\+?\d{9,15}$/,
      "Contact phone must be a valid number (9–15 digits, optional +)"
    ),
  pickup_address_text: z.string().min(5).max(300),
  pickup_window_id: z.string().min(1, "Pickup window is required"),
  pickup_lat: z.number(),
  pickup_lon: z.number(),
})

export type VendorFormData = z.infer<typeof vendorSchema>

export default function VendorProfileForm({
  vendor,
  pickupWindows,
}: {
  vendor: CurrentUser["vendor"]
  pickupWindows: TimeWindow[]
}) {
  // deduce pickup_window_id from vendor's pickup_window_start and pickup_window_end
  const pickupWindow = pickupWindows.find((window) => {
    return (
      window.start === vendor?.pickup_window_start &&
      window.end === vendor?.pickup_window_end
    )
  })

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      contact_name: vendor?.contact_name || "",
      contact_phone: vendor?.contact_phone || "",
      pickup_lat: vendor?.pickup_lat || undefined,
      pickup_lon: vendor?.pickup_lon || undefined,
      pickup_address_text: vendor?.pickup_address_text || "",
      pickup_window_id: pickupWindow?.id || "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: VendorFormData) => updateVendor(data),
    onSuccess: () => {
      toast.success("Profile details updated!", {
        duration: 5000,
      })
    },
    onError: (error) => {
      toast.error("Failed to update profile details", {
        description: <div className="whitespace-pre-line">{error.message}</div>,
        duration: 8000,
      })
    },
  })

  function onSubmit(values: VendorFormData) {
    mutation.mutate(values)
  }

  return (
    <div>
      {!vendor?.profile_complete && (
        <Alert variant="warning" className="mb-4 max-w-lg">
          <BookUser />
          <AlertTitle>Complete Your Profile</AlertTitle>
          <AlertDescription>
            Please complete your profile details below to start creating and
            managing orders.
          </AlertDescription>
        </Alert>
      )}
      <Card className="w-full max-w-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Name" {...field} />
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
                      <Input
                        placeholder="Contact Phone"
                        {...field}
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pickup_address_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Address</FormLabel>
                    <PickupLocationMap />
                    <FormControl>
                      <Input placeholder="Pickup Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pickup_window_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Window</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full data-[size=default]:h-max">
                          <SelectValue placeholder="Select a pickup window" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Pickup Windows</SelectLabel>
                            {pickupWindows.map((window) => (
                              <SelectItem key={window.id} value={window.id}>
                                <div className="flex flex-col items-start">
                                  <span className="font-semibold">
                                    {window.name}
                                  </span>
                                  <p className="text-sm text-muted-foreground">
                                    {convertUTCToLocalTime(window.start)} -{" "}
                                    {convertUTCToLocalTime(window.end)}
                                  </p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  )
}
