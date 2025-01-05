"use client";

import { signIn } from "@/lib/auth/client";
import {
  type AccountData,
  accountSchema,
  loginSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { toast } from "@platter/ui/components/sonner";
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
  const router = useRouter();
  const [type, setType] = useState<"text" | "password">("password");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formdata: AccountData) => {
    const { data, error } = await signIn.email(
      {
        email: formdata.email,
        password: formdata.password,
      },
      {
        onRequest: () => {
          toast.loading("Loggin In", { id: "login" });
        },
        onSuccess: () => {
          toast.success("Login Successfull", { id: "login" });
          router.push("/");
        },
        onError: () => {
          toast.error("Something went wrong", { id: "login" });
        },
      },
    );
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your details to login.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} type="email" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input {...register("password")} type={type} className="pr-6" />
              <button
                type="button"
                title="toggle password visibility"
                onClick={() =>
                  setType(type === "password" ? "text" : "password")
                }
                className="absolute top-1/2 right-4 transform -translate-y-1/2 group"
              >
                {type === "password" ? (
                  <EyeClosedIcon className="size-4 text-muted-foreground group-hover:text-primary" />
                ) : (
                  <EyeIcon className="size-4 text-muted-foreground group-hover:text-primary" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="flex items-center gap-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin transition" />
            )}
            {isSubmitting ? "Creating account..." : "Login"}
          </Button>

          <p className="text-center text-muted-foreground text-xs">
            Don't have an account?{" "}
            <Link href="/register" className="hover:text-primary underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default LoginForm;
