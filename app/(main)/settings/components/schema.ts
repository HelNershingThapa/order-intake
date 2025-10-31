import { z } from "zod"

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
  contact_phone: z.string().min(1, "Contact phone is required"),
  address: z.string().min(1, "Address is required"),
  pickup_windows: z
    .array(timeWindowSchema)
    .min(1, "At least one time window is required"),
})

export type AdminProfileData = z.infer<typeof adminProfileSchema>
