import { z } from "zod"

import { validatePhoneNumber } from "@/utils/validate-phone"

const timeWindowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  start: z.string().min(1, "Required"),
  end: z.string().min(1, "Required"),
  is_active: z.boolean().optional(),
})

export type TimeWindow = z.infer<typeof timeWindowSchema> & { id: string }

export const adminProfileSchema = z.object({
  contact_name: z.string().min(1, "Contact name is required"),
  contact_phone: z
    .string({
      error: "Contact phone number is required",
    })
    .refine(validatePhoneNumber, {
      message: "Please enter a valid Nepali phone number",
    }),
  address: z.string().min(1, "Address is required"),
  pickup_windows: z
    .array(timeWindowSchema)
    .min(1, "At least one time window is required"),
})

export type AdminProfileData = z.infer<typeof adminProfileSchema>
