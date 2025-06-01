// app/api/request-access/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory rate limiting store (consider Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 3, // Max requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxPerEmail: 1, // Max requests per email per day
  emailWindowMs: 24 * 60 * 60 * 1000, // 24 hours
};

function getRateLimitKey(ip: string, type: 'ip' | 'email', identifier?: string): string {
  return type === 'ip' ? `ip:${ip}` : `email:${identifier}`;
}

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (record.count >= maxRequests) {
    return true;
  }
  
  // Increment count
  record.count++;
  rateLimitStore.set(key, record);
  return false;
}

function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  

  return realIP || cfConnectingIP || 'unknown';
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
    const ipKey = getRateLimitKey(clientIP, 'ip');
    if (isRateLimited(ipKey, RATE_LIMIT.maxRequests, RATE_LIMIT.windowMs)) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(RATE_LIMIT.windowMs / 1000 / 60) // minutes
        }, 
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(RATE_LIMIT.windowMs / 1000))
          }
        }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' }, 
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // Rate limit by email (prevent same email from spamming)
    const emailKey = getRateLimitKey(clientIP, 'email', sanitizedEmail);
    if (isRateLimited(emailKey, RATE_LIMIT.maxPerEmail, RATE_LIMIT.emailWindowMs)) {
      return NextResponse.json(
        { 
          error: 'This email has already been submitted recently. Please try again tomorrow.',
          retryAfter: Math.ceil(RATE_LIMIT.emailWindowMs / 1000 / 60 / 60) // hours
        }, 
        { status: 429 }
      );
    }

    // Send email
    await resend.emails.send({
      from: 'noreply@platterng.com',
      to: 'ibrahimdoba55@gmail.com',
      subject: 'New RestaurantQR Access Request',
      html: `
        <h2>New Access Request</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>IP Address:</strong> ${clientIP}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Request submitted successfully'
    });

  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send request. Please try again later.' }, 
      { status: 500 }
    );
  }
}

// Optional: Cleanup function to remove old entries (call periodically)
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}