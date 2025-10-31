"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function VendorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative h-64 w-full">
        <Image
          priority
          src="/bug-fixing.svg"
          fill
          alt="Bug fixing illustration"
          style={{ objectFit: "contain" }}
        />
      </div>
      <h2 className="font-semibold text-2xl">Something went wrong...</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
