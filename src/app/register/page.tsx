import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import registerImage from '@/assets/signup.jpg'
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <Link href="/" className="font-semibold mr-4 playwrite-ro text-3xl">
              Opinia
            </Link>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-white border-l-2">
              <Image
                src={registerImage}
                alt="Login"
                className="w-[400px] h-auto object-contain dark:brightness-[0.2] dark:grayscale"
              />
            </div>
    </div>
  );
}
