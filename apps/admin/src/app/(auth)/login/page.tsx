import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
};

async function Page() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default Page;
