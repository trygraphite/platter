"use client";

import { authClient } from "@/lib/auth/client";
import { type AccountData, loginSchema } from "@/lib/validations/auth";
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
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { toast } from "@platter/ui/components/sonner";
import { EyeClosedIcon, EyeIcon, Loader2, Lock, Mail } from "lucide-react";

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
    try {
      await authClient.signIn.email(
        {
          email: formdata.email,
          password: formdata.password,
        },
        {
          onSuccess: () => {
            toast.success("Login Successful");
            router.push("/");
          },
          onError: () => {
            toast.error("Invalid Password Or Email");
          },
        },
      );
    } catch (error) {
      toast.error("Request failed. Please try again.");
    }
  };

  return (
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="mx-auto bg-primary/10 p-2 rounded-full mb-3">
            <Lock className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  {...register("email")} 
                  type="email" 
                  placeholder="name@example.com"
                  className="pl-10 bg-muted/30 border-muted focus:bg-background transition-colors" 
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link
                  href="/forgot"
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  {...register("password")} 
                  type={type} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10 bg-muted/30 border-muted focus:bg-background transition-colors" 
                />
                <button
                  type="button"
                  title="toggle password visibility"
                  onClick={() => setType(type === "password" ? "text" : "password")}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 p-1 rounded-md hover:bg-muted/50"
                >
                  {type === "password" ? (
                    <EyeClosedIcon className="size-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="size-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              className="w-full py-5 font-medium text-sm shadow-sm hover:shadow transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <p className="text-center text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                Create account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
  );
}

export default LoginForm;