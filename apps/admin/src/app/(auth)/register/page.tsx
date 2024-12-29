import RegistrationForm from "@/components/auth/register-form";
import Container from "@/components/shared/container";
import Link from "next/link";
import React, { Suspense } from "react";

function RegisterPage() {
  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold lg:text-2xl">Create account</h1>
          <p className="text-muted-foreground text-sm">
            Please fill in the details below.
          </p>
        </div>

        <Suspense>
          <RegistrationForm />
        </Suspense>

        <p className="text-muted-foreground px-8 text-center text-xs mt-8 ">
          By signing up, you agree to our{" "}
          <Link
            href="https://platterweb.vercel.app/terms"
            target="_blank"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="https://platterweb.vercel.app/privacy"
            target="_blank"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}

export default RegisterPage;
