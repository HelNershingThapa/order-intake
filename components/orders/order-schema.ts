import * as z from "zod";

const trimCollapse = (s: string) => s.trim().replace(/\s+/g, " ");

const optFloat = (label: string, min?: number, max?: number) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z
      .number()
      .refine((n) => !Number.isNaN(n), { message: `${label} must be a number` })
      .refine((n) => (min === undefined ? true : n > min), {
        message: `${label} must be > ${min}`,
      })
      .refine((n) => (max === undefined ? true : n <= max), {
        message: `${label} must be ≤ ${max}`,
      })
      .optional()
  );

const optInt = (label: string, min?: number) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z
      .number()
      .int(`${label} must be an integer`)
      .min(min ?? 0, `${label} must be ≥ ${min}`)
      .optional()
  );

export const dimensionsSchema = z
  .object({
    l: optInt("Length", 1),
    w: optInt("Width", 1),
    h: optInt("Height", 1),
  })
  .refine(
    (vals) => {
      const provided = [vals.l, vals.w, vals.h].filter((v) => v !== undefined);
      return provided.length === 0 || provided.length === 3;
    },
    { message: "Provide all dimensions or leave all empty" }
  );

export const orderSchema = z
  .object({
    recipient_name: z
      .string()
      .min(1, "Recipient name is required")
      .transform(trimCollapse),
    recipient_phone: z
      .string()
      .min(1, "Phone is required")
      .regex(/^\+?\d{7,15}$/, "Phone must be 7-15 digits with optional +"),
    delivery_address_text: z
      .string()
      .min(1, "Delivery address is required")
      .transform(trimCollapse),
    municipality: z
      .string()
      .optional()
      .transform((v) => (v ? trimCollapse(v) : undefined)),
    ward: z
      .string()
      .optional()
      .transform((v) => (v ? trimCollapse(v) : undefined)),
    tole: z
      .string()
      .optional()
      .transform((v) => (v ? trimCollapse(v) : undefined)),
    landmark: z
      .string()
      .optional()
      .transform((v) => (v ? trimCollapse(v) : undefined)),
    lat: optFloat("Latitude", -90, 90),
    lng: optFloat("Longitude", -180, 180),
    weight_kg: z.preprocess(
      (v) =>
        v === "" || v === null || v === undefined ? undefined : Number(v),
      z.number().gt(0, "Weight must be > 0").lte(1000, "Max 1000 kg")
    ),
    dimensions: dimensionsSchema.optional(),
  })
  .refine((vals) => (vals.lat !== undefined) === (vals.lng !== undefined), {
    message: "Provide both lat and lng together",
    path: ["lat"],
  });

export type OrderFormData = z.infer<typeof orderSchema>;
