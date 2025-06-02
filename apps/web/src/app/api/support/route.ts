// app/api/support/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { cleanupRateLimit, isRateLimited, RATE_LIMIT } from '@/app/lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY);

// Support-specific rate limit key function with prefix
function getSupportRateLimitKey(ip: string, type: 'ip' | 'email', identifier?: string): string {
  return type === 'ip' ? `support:ip:${ip}` : `support:email:${identifier}`;
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

function validatePhone(phone: string): boolean {
  // Allow various phone formats, optional field
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

function sanitizeInput(input: string, maxLength: number = 500): string {
  return input.trim().substring(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Rate limit by IP
    const ipKey = getSupportRateLimitKey(clientIP, 'ip');
    if (isRateLimited(ipKey, RATE_LIMIT.maxRequests, RATE_LIMIT.windowMs)) {
      return NextResponse.json(
        { 
          error: 'Too many support requests. Please try again later.',
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
    const { name, email, phone, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' }, 
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

    // Validate phone if provided
    if (phone && !validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' }, 
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name, 100);
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedPhone = phone ? sanitizeInput(phone, 20) : '';
    const sanitizedSubject = subject ? sanitizeInput(subject, 200) : '';
    const sanitizedMessage = sanitizeInput(message, 2000);

    // Additional validation for message length
    if (sanitizedMessage.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' }, 
        { status: 400 }
      );
    }

    // Rate limit by email
    const emailKey = getSupportRateLimitKey(clientIP, 'email', sanitizedEmail);
    if (isRateLimited(emailKey, RATE_LIMIT.maxPerEmail, RATE_LIMIT.emailWindowMs)) {
      return NextResponse.json(
        { 
          error: 'This email has already submitted a support request recently. Please try again tomorrow.',
          retryAfter: Math.ceil(RATE_LIMIT.emailWindowMs / 1000 / 60 / 60) // hours
        }, 
        { status: 429 }
      );
    }

    // Send email to support team
    await resend.emails.send({
      from: 'noreply@platterng.com',
      to: 'ibrahimdoba55@gmail.com',
      subject: `Support Request: ${sanitizedSubject || 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
            New Support Request
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Contact Information</h3>
            <p><strong>Name:</strong> ${sanitizedName}</p>
            <p><strong>Email:</strong> ${sanitizedEmail}</p>
            ${sanitizedPhone ? `<p><strong>Phone:</strong> ${sanitizedPhone}</p>` : ''}
            <p><strong>Subject:</strong> ${sanitizedSubject || 'General Inquiry'}</p>
            <p><strong>IP Address:</strong> ${clientIP}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #555;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Quick Actions:</strong><br>
              • Reply directly to this email to respond to the customer<br>
              • Customer email: <a href="mailto:${sanitizedEmail}" style="color: #0066cc;">${sanitizedEmail}</a><br>
              ${sanitizedPhone ? `• Customer phone: <a href="tel:${sanitizedPhone}" style="color: #0066cc;">${sanitizedPhone}</a><br>` : ''}
              ${sanitizedPhone ? `• WhatsApp: <a href="https://wa.me/${sanitizedPhone.replace(/\D/g, '')}" style="color: #0066cc;">Send WhatsApp message</a>` : ''}
            </p>
          </div>
        </div>
      `
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'support@platterng.com',
      to: sanitizedEmail,
      subject: 'We received your message - Platter Support',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for contacting us!</h2>
          
          <p>Hi ${sanitizedName},</p>
          
          <p>We've received your support request and our team will get back to you within 24 hours during business days.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Request Details:</h3>
            <p><strong>Subject:</strong> ${sanitizedSubject || 'General Inquiry'}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Need faster support?</h4>
            <p style="margin-bottom: 0;">
              For immediate assistance, you can reach us on WhatsApp at 
              <a href="https://wa.me/2348149113328" style="color: #0066cc;">+234 81 49113328</a>
            </p>
          </div>
          
          <p>
            <strong>Business Hours:</strong><br>
            Monday - Friday: 9:00 AM - 6:00 PM<br>
            Saturday: 10:00 AM - 4:00 PM<br>
            Sunday: Closed
          </p>
          
          <p>
            Best regards,<br>
            <strong>Platter Support Team</strong>
          </p>
        </div>
      `
    });

    // Clean up old rate limit entries (now calls internal function)
    cleanupRateLimit();
    
    return NextResponse.json({ 
      success: true,
      message: 'Support request sent successfully'
    });
    
  } catch (error) {
    console.error('Support email error:', error);
    return NextResponse.json(
      { error: 'Failed to send support request. Please try again or contact us directly.' }, 
      { status: 500 }
    );
  }
}