"use client"

import { authClient } from "@/lib/auth/client";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { toast } from "@platter/ui/components/sonner";
import { Loader2, MailCheck } from "lucide-react";
import React, { useState } from "react";

function PageContent({ userEmail }: { userEmail: string }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"pending" | "sent" | "failed">(
    "pending",
  );

  console.log(userEmail)

  const handleEmailVerification = async (email: string) => {
    setSending(true);
    try {
      await authClient.sendVerificationEmail({
        email: email,
        callbackURL: "/",
      });
      setStatus("sent");
    } catch (error) {
      toast.error("Failed to send");
      setStatus("failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      {status === "pending" && (
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription className="sr-only">
            Verify your account before proceeding
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {status === "sent" && (
          <div className="space-y-4 pt-8 pb-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <MailCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center">Sent!</h2>
            <p className="text-center">
              We've sent a verification link to your mail follow the link in the
              mail to verify your account.
            </p>
          </div>
        )}
        {status === "pending" && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-muted-foreground text-center">
              You need to verify that you own the email address to use our app.
              Click the link below to send a verification to your email.
            </p>
            <Button
              disabled={sending}
              onClick={() => handleEmailVerification(userEmail)}
            >
              {sending ? "Sending..." : "Send Verification"}
            </Button>
          </div>
        )}
        {status === "failed" && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-muted-foreground text-center">
              Something went wrong please click the button below to resend an
              email.
            </p>
            <Button
              disabled={sending}
              onClick={() => handleEmailVerification(userEmail)}
              className="flex gap-2"
            >
              {sending && <Loader2 className="size-4 animate-spin" />}
              {sending ? "Sending..." : "Send Verification"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PageContent;
