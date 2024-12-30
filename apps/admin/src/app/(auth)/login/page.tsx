import LoginForm from "@/components/auth/login-form";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
};

function Page() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default Page;
