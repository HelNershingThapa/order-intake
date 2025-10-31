import Image from "next/image"

import { Input } from "@/components/ui/input"

export const PhoneInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => {
  return (
    <div className="relative">
      <Input className="start-8 indent-[60px]" type="tel" {...props} />
      <div className="absolute top-2 left-3 flex items-center gap-2 text-sm">
        <Image src="/nepal-flag.svg" alt="Nepal Flag" height={12} width={12} />
        +977
      </div>
    </div>
  )
}
