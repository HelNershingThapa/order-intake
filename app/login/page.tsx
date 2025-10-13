import { LoginForm } from "./components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center items-center gap-2 md:justify-start">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-12 w-auto"
            priority
          />
          Order Intake
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          priority
          src="/order-delivery.jpg"
          alt="Image"
          fill
          sizes="(min-width: 1024px) 50vw, 0px"
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
