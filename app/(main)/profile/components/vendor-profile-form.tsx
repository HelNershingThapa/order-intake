"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { BookUser, Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { PhoneInput } from "@/components/phone-input"
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
import { validatePhoneNumber } from "@/utils/validate-phone"

import { TimeWindow } from "../../settings/components/schema"
import { updateVendor } from "../actions"
import { PickupLocationMap } from "./pickup-location-map"

const vendorSchema = z.object({
  contact_name: z.string().min(2).max(100),
  contact_phone: z
    .string({
      error: "Contact phone number is required",
    })
    .refine(validatePhoneNumber, {
      message: "Please enter a valid Nepali phone number",
    }),
  pickup_address_text: z.string().min(5).max(300),
  pickup_window_id: z.string().min(1, "Pickup window is required"),
  pickup_lat: z.number(),
  pickup_lon: z.number(),
  suggested_address: z.string().optional(),
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
      suggested_address: "",
    },
  })

  const suggestedAddress = form.watch("suggested_address")

  const handleAcceptSuggestion = () => {
    if (suggestedAddress) {
      form.setValue("pickup_address_text", suggestedAddress)
      form.setValue("suggested_address", "")
    }
  }

  const handleRejectSuggestion = () => {
    form.setValue("suggested_address", "")
  }

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { suggested_address, ...dataToSubmit } = values
    mutation.mutate(dataToSubmit)
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
      <Card className="w-full md:w-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
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
                    <FormLabel required>Contact Phone</FormLabel>
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
              <FormField
                control={form.control}
                name="pickup_address_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Pickup Address</FormLabel>
                    <PickupLocationMap />
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="ps-7"
                          placeholder="Pickup Address"
                          {...field}
                        />
                        <span className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2 font-medium">
                          <MapPin className="size-4" />
                        </span>
                      </div>
                    </FormControl>
                    {suggestedAddress && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Suggested Address:
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                          {suggestedAddress}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="default"
                            onClick={handleAcceptSuggestion}
                          >
                            Accept
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleRejectSuggestion}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pickup_window_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Pickup Window</FormLabel>
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
                              <SelectItem
                                key={window.id}
                                value={window.id}
                                disabled={!window.is_active}
                              >
                                <div className="flex flex-col items-start">
                                  <span className="font-semibold">
                                    {window.name}
                                    {!window.is_active && (
                                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                                        (Inactive)
                                      </span>
                                    )}
                                  </span>
                                  <p className="text-sm text-muted-foreground">
                                    {window.start} - {window.end}
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="animate-spin" />}Save
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  )
}
