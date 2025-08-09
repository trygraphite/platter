// app/api/request-access/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getRateLimitKey,
  isRateLimited,
  RATE_LIMIT,
} from "@/app/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const _forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  return realIP || cfConnectingIP || "unknown";
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeInput(input: string): string {
  return input.trim().substring(0, 100); // Limit length and trim
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Rate limit by IP
    const ipKey = getRateLimitKey(clientIP, "ip");
    if (isRateLimited(ipKey, RATE_LIMIT.maxRequests, RATE_LIMIT.windowMs)) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil(RATE_LIMIT.windowMs / 1000 / 60), // minutes
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(RATE_LIMIT.windowMs / 1000)),
          },
        },
      );
    }

    const body = await request.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // Rate limit by email (prevent same email from spamming)
    const emailKey = getRateLimitKey(clientIP, "email", sanitizedEmail);
    if (
      isRateLimited(emailKey, RATE_LIMIT.maxPerEmail, RATE_LIMIT.emailWindowMs)
    ) {
      return NextResponse.json(
        {
          error:
            "This email has already been submitted recently. Please try again tomorrow.",
          retryAfter: Math.ceil(RATE_LIMIT.emailWindowMs / 1000 / 60 / 60), // hours
        },
        { status: 429 },
      );
    }

    // Send email
    await resend.emails.send({
      from: "noreply@platterng.com",
      to: "ibrahimdoba55@gmail.com",
      subject: "New RestaurantQR Access Request",
      html: `
        <h2>New Access Request</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>IP Address:</strong> ${clientIP}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Request submitted successfully",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send request. Please try again later." },
      { status: 500 },
    );
  }
}
