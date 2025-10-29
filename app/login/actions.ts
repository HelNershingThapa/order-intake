"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { FormState, LoginFormSchema } from "@/lib/definitions"
import { createSession, deleteSession } from "@/lib/session"
import { LoginResponse } from "@/types/miscellaneous"

type ApiError = { detail?: string; message?: string } | string | null

export const login = async (state: FormState, formData: FormData) => {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    }
  }
  const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    }),
  })

  if (!response.ok) {
    let message = `Login failed (${response.status})`
    try {
      const data = (await response.json()) as ApiError
      if (typeof data === "string") {
        message = data
      } else if (data?.detail) {
        message = data.detail
      } else if (data?.message) {
        message = data.message
      }
    } catch {
      // ignore parse errors
    }
    console.log(message)
    throw new Error(message)
  }

  const res = (await response.json()) as LoginResponse
  await createSession(res)
  redirect("/orders")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
