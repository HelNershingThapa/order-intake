"use client";

import { useActionState, useEffect, useRef } from "react";
import { loginAction } from "./actions"; // Next 15 / React 19
export const INITIAL_STATE: State = {
  zodErrors: null,
  backend_error: null,
  data: { name: "", apikey: "" },
  message: null,
};

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ZodErrors from "@/components/custom/zod-errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { State } from "./stats";

export default function VendorLoginPage() {
  const router = useRouter();

  const redirected = useRef(false);
  const lastError = useRef<string | null>(null);

  const [formState, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_STATE
  );
  const { name, apikey } = formState.data;

  useEffect(() => {
    // error toast
    if (
      formState.backend_error &&
      formState.backend_error !== lastError.current
    ) {
      lastError.current = formState.backend_error;
      toast.error("Login failed", { description: formState.backend_error });
    }

    // success redirectt-righ
    if (!redirected.current && formState?.message === "Logged in") {
      redirected.current = true;
      toast.success("User Logged in");
      router.push("/vendor/dashboard");
    }
  }, [formState.backend_error, formState?.message, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold">Vendor Login</h2>
          <p className="mt-1 text-sm text-gray-600">Enter your credentials</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Use your vendor name and API key</CardDescription>
          </CardHeader>
          <CardContent>
            {formState.backend_error && (
              <div role="alert" className="text-red-600 text-sm mb-3">
                {formState.backend_error}
              </div>
            )}

            <form action={formAction} className="space-y-6" noValidate>
              {/* Vendor Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Vendor Name
                </label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={name}
                  aria-invalid={
                    !!formState.zodErrors?.name?.length || undefined
                  }
                  aria-describedby={
                    formState.zodErrors?.name?.length ? "name-error" : undefined
                  }
                />
                <ZodErrors id="name-error" error={formState.zodErrors?.name} />
              </div>

              {/* API Key */}
              <div>
                <label htmlFor="apikey" className="block text-sm font-medium">
                  API Key
                </label>
                <Input
                  id="apikey"
                  name="apikey"
                  type="password"
                  defaultValue={apikey ? "••••••••" : ""}
                  aria-invalid={
                    !!formState.zodErrors?.apikey?.length || undefined
                  }
                  aria-describedby={
                    formState.zodErrors?.apikey?.length
                      ? "apikey-error"
                      : undefined
                  }
                />
                <ZodErrors
                  id="apikey-error"
                  error={formState.zodErrors?.apikey}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600">
          Don’t have an API key? Contact your admin.
        </p>
      </div>
    </div>
  );
}
