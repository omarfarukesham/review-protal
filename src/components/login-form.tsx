"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RedirectUrl } from "./ui/FormComponents";
import { handleAuthentication } from "@/Services/Auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import formSchema from "@/Schema/Zod/ZodSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { IAuth } from "@/types/globals";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { getToken } from "@/Services/GlobalServices";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/authSlice";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const dispatch = useDispatch();
  const pathName = usePathname();
  const isRegistrationPage = pathName.endsWith("/register");
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log("hitting");
    // console.log(values);
    let result;
    const toastId = toast.loading(
      `${isRegistrationPage ? "Registering" : "Logging in"}...`
    );
    const actionType = isRegistrationPage ? "create" : "login";
    if (isRegistrationPage) {
      result = await handleAuthentication(actionType, values as IAuth);
    } else {
      result = await handleAuthentication(actionType, values as IAuth);
      const token = await getToken();
      // const user = {
      //   email: result?.data?.email,
      //   name: result?.data?.name,
      //   role: result?.data?.role,
      // };
      // console.log("user", user);
      const tokenF = await getToken();
      const authUser = {
        user: {
          email: result?.data?.email,
          name: result?.data?.name,
          role: result?.data?.role,
        },
        token: tokenF,
      };
      dispatch(setUser(authUser));
      await signIn("credentials", {
        // Include all the data you need in the session
        email: result?.data?.email,
        name: result?.data?.name,
        role: result?.data?.role,
        photoUrl: result?.data?.photoUrl || "",
        // Use a special flag to indicate this was pre-authenticated
        isPreAuthenticated: "true",
        token,
      });
    }
    if (result?.success) {
      router.push("/");
      toast.success(result.message, { id: toastId });
    } else {
      toast.error(result?.message, { id: toastId });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.error(errors))}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          {isRegistrationPage && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-3">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jon Doe" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-3">Email</FormLabel>
                <FormControl>
                  <Input placeholder="tXa3o@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isRegistrationPage ? <span>Sign Up</span> : <span>Sign In</span>}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
        </div>
        <RedirectUrl />
      </form>
    </Form>
  );
}
