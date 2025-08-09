import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import RegistrationForm from "@/components/auth/register-form";
import Container from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Register",
};

function RegisterPage() {
  return (
    <Container className="py-12">
      <Suspense>
        <div className="w-fit mx-auto">
          <RegistrationForm />
        </div>
      </Suspense>

      <p className="text-muted-foreground px-8 text-center text-xs mt-8 ">
        By signing up, you agree to our{" "}
        <Link
          href="https://platterng.com/terms"
          target="_blank"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="https://platterng.com/privacy"
          target="_blank"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </Container>
  );
}

export default RegisterPage;
