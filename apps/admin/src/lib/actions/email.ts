"use server";

import { Resend } from "resend";
import getServerSession from "../auth/server";
import { VerifyUserEmail } from "@/components/emails/verify";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailProps {
  email: string;
  url: string;
}

export async function sendVerificationEmailAction({
  email,
  url,
}: SendVerificationEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set or is missing");
    return { error: "Email configuration missing" };
  }
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 401 },
    );
  }

  console.log("called verification email");
  try {
    const response = await resend.emails.send({
      from: "Platter Verifications <emails@platterng.com>",
      to: email,
      subject: "Verify your email address",
      react: VerifyUserEmail({
        email,
        url,
      }),
    });

    console.log("Email sent successfully:", response);
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Detailed error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error },
      { status: 500 },
    );
  }
}
