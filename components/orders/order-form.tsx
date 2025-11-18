'use client'

import { useTransition } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { OrderLocationMap } from '@/components/orders/order-location-map'
import {
  type OrderFormData,
  orderSchema,
} from '@/components/orders/order-schema'
import { PhoneInput } from '@/components/phone-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createOrder, updateOrder } from '@/lib/order-service'
import type { Order } from '@/types/order'

type OrderFormProps = {
  initialData?: Order & { id: string }
  mode: 'create' | 'edit'
}

// Extract default values to prevent hydration mismatches
const getDefaultValues = (initialData?: Order): Partial<OrderFormData> => {
  if (initialData) {
    return {
      recipient_name: initialData.recipient_name || '',
      recipient_phone: initialData.recipient_phone || '',
      delivery_address_text: initialData.delivery_address_text || '',
      municipality: initialData.municipality || '',
      ward: initialData.ward || '',
      tole: initialData.tole || '',
      landmark: initialData.landmark || '',
      lat: initialData.lat ?? undefined,
      lng: initialData.lng ?? undefined,
      weight_kg: initialData.weight_kg ?? 0,
      cod_amount: initialData.cod_amount,
      dimensions: initialData.dimensions
        ? {
            l: initialData.dimensions.l ?? undefined,
            w: initialData.dimensions.w ?? undefined,
            h: initialData.dimensions.h ?? undefined,
          }
        : {
            l: undefined,
            w: undefined,
            h: undefined,
          },
    }
  }

  return {
    recipient_name: '',
    recipient_phone: '',
    delivery_address_text: '',
    municipality: '',
    ward: '',
    tole: '',
    landmark: '',
    lat: undefined,
    lng: undefined,
    weight_kg: 0,
    dimensions: { l: undefined, w: undefined, h: undefined },
  }
}

export default function OrderForm({ initialData, mode }: OrderFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema) as Resolver<OrderFormData>,
    defaultValues: getDefaultValues(initialData),
  })

  const onSubmit = (data: OrderFormData) => {
    startTransition(async () => {
      try {
        if (mode === 'create') {
          const result = await createOrder(data)
          toast.success(`Order created (#${result.order_id})`)
          router.push('/orders')
        } else if (initialData) {
          await updateOrder(initialData.id, data)
          toast.success(`Order updated (#${initialData.id})`)
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred'
        toast.error(`Failed to ${mode} order`, {
          description: errorMessage,
        })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Add Order' : `Edit Order #${initialData?.id}`}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recipient_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Recipient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipient_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="delivery_address_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Delivery Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kathmandu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tole</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lazimpat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmark</FormLabel>
                    <FormControl>
                      <Input placeholder="Near City Mall" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cod_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>COD Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Cash on Delivery"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(
                            value === '' ? undefined : parseFloat(value) || 0,
                          )
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight_kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1.5"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <OrderLocationMap />
            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="27.7172"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="85.3240"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dimensions */}
            <div>
              <Label className="mb-2 block">Dimensions (cm)</Label>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dimensions.l"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="30"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimensions.w"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="20"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimensions.h"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isPending} className="mr-2">
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Add Order' : 'Update Order'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
