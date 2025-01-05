"use client";

import { signUp } from "@/lib/auth/client";
import { type AccountData, accountSchema } from "@/lib/validations/auth";
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

export default function RegisterForm() {
  const [type, setType] = useState<"text" | "password">("password");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountData>({
    resolver: zodResolver(accountSchema),
  });

  const onSubmit = async (formdata: AccountData) => {
    const { confirmPassword, ...submitData } = formdata;
    await signUp
      .email(
        {
          name: submitData.email.split("@")[0] as string,
          email: submitData.email,
          password: submitData.password,
          callbackURL: "/register/details",
        },
        {
          onRequest: () => {
            toast.loading("Creating account...", { id: "signup" });
          },
          onSuccess: () => {
            toast.success("Account created", { id: "signup" });
            router.push("/register/details");
          },
          onError: (ctx) => {
            toast.error("Failed to create account", { id: "signup" });
          },
        },
      )
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Card className="w-96">
      <CardHeader className="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Please fill in the details below.</CardDescription>
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
            <Label htmlFor="password">Password</Label>
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                type={type}
                className="pr-6"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
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
            {isSubmitting ? "Creating account..." : "Submit"}
          </Button>

          <p className="text-center text-muted-foreground text-xs">
            Have an account?{" "}
            <Link href="/login" className="hover:text-primary underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
