"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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

const STORAGE_KEY = "route360-api-key"

const formSchema = z.object({
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
})

export function ApiKeyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  })

  useEffect(() => {
    if (globalThis.window !== undefined) {
      const savedKey = globalThis.localStorage.getItem(STORAGE_KEY)
      if (savedKey) {
        form.setValue("apiKey", savedKey)
      }
    }
  }, [form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (globalThis.window !== undefined) {
        globalThis.localStorage.setItem(STORAGE_KEY, values.apiKey)
        toast.success("API key saved successfully")
      }
    } catch (error) {
      console.error("Failed to save API key:", error)
      toast.error("Failed to save API key")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <h3 className="text-lg font-medium">Route360 API Key</h3>
              </FormLabel>
              <FormDescription>
                This key will be used to fetch configured runs and generate the
                run. You can find your token in your Route360 portal under
                Settings → API Config.{" "}
                <a
                  href="https://vrs.baato.io/dashboard/settings/api-config"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium underline"
                >
                  Open API Config
                </a>
              </FormDescription>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm">
          Update API Key
        </Button>
      </form>
    </Form>
  )
}
