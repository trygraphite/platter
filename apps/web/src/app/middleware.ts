// middleware.ts (place in your Next.js root directory)
import { NextRequest, NextResponse } from 'next/server';

// Type definitions
interface DDoSConfig {
  windowMs: number;
  maxRequests: number;
  maxRequestsPerSecond: number;
  maxPayloadSize: number;
  whitelist: string[];
  allowedMethods: string[];
  enableLogging: boolean;
  protectedPaths: string[];
  excludedPaths: string[];
}

interface RequestCount {
  [key: string]: number;
}

interface SuspiciousActivity {
  [key: string]: number;
}

interface DDoSStats {
  activeConnections: number;
  blacklistedIPs: number;
  suspiciousActivities: number;
  configuredLimits: {
    maxRequests: number;
    windowMs: number;
    maxRequestsPerSecond: number;
  };
}

type LogType = 'ACCESS' | 'BLOCK' | 'SECURITY' | 'INFO';

// In-memory storage (consider using Upstash Redis or Vercel KV for production)
const requestCounts = new Map<string, number>();
const secondCounts = new Map<string, number>();
const suspiciousIPs = new Map<string, number>();
const blacklistedIPs = new Set<string>();

// Configuration
const config: DDoSConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // requests per window per IP
  maxRequestsPerSecond: 10, // requests per second per IP
  maxPayloadSize: 1024 * 1024, // 1MB
  whitelist: [
    '127.0.0.1',
    '::1',
    // Add your trusted IPs here
  ],
  allowedMethods: ['GET', 'POST', 'HEAD', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
  enableLogging: true,
  // Paths to protect (empty array means protect all)
  protectedPaths: [
    // '/api/',
    // '/contact',
    // '/login'
  ],
  // Paths to exclude from protection
  excludedPaths: [
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    '/.well-known/',
  ]
};

/**
 * Extract client IP address from request headers
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  const xClientIP = request.headers.get('x-client-ip');
  
  return forwarded?.split(',')[0]?.trim() || 
         realIP || 
         cfConnectingIP ||
         xClientIP ||        
         '0.0.0.0';
}

/**
 * Check if IP is in whitelist
 */
function isWhitelisted(ip: string): boolean {
  return config.whitelist.includes(ip);
}

/**
 * Check if IP is in blacklist
 */
function isBlacklisted(ip: string): boolean {
  return blacklistedIPs.has(ip);
}

/**
 * Determine if path should be protected
 */
function shouldProtectPath(pathname: string): boolean {
  // Check excluded paths first
  if (config.excludedPaths.some(path => pathname.startsWith(path))) {
    return false;
  }
  
  // If no protected paths specified, protect all
  if (config.protectedPaths.length === 0) {
    return true;
  }
  
  // Check if path matches protected paths
  return config.protectedPaths.some(path => pathname.startsWith(path));
}

/**
 * Check per-second rate limit
 */
function checkPerSecondLimit(ip: string): boolean {
  const now = Date.now();
  const secondKey = `${ip}:${Math.floor(now / 1000)}`;
  const count = secondCounts.get(secondKey) ?? 0;
  
  if (count >= config.maxRequestsPerSecond) {
    return false;
  }
  
  secondCounts.set(secondKey, count + 1);
  
  // Clean up old second counts (keep only last 2 seconds)
  const cutoff = Math.floor(now / 1000) - 2;
  for (const [key] of secondCounts) {
    const timestamp = parseInt(key.split(':')[1] ?? '0');
    if (timestamp < cutoff) {
      secondCounts.delete(key);
    }
  }
  
  return true;
}

/**
 * Check window-based rate limit
 */
function checkWindowLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = Math.floor(now / config.windowMs) * config.windowMs;
  const windowKey = `${ip}:${windowStart}`;
  const count = requestCounts.get(windowKey) ?? 0;
  
  if (count >= config.maxRequests) {
    return false;
  }
  
  requestCounts.set(windowKey, count + 1);
  
  // Clean up old window counts
  const cutoff = now - config.windowMs;
  for (const [key] of requestCounts) {
    const timestamp = parseInt(key.split(':')[1] ?? '0');
    if (timestamp < cutoff) {
      requestCounts.delete(key);
    }
  }
  
  return true;
}

/**
 * Check for suspicious request patterns
 */
function isSuspiciousRequest(request: NextRequest, ip: string): boolean {
  const url = request.url;
  const userAgent = request.headers.get('user-agent') ?? '';
  const referer = request.headers.get('referer') ?? '';
  
  // Suspicious patterns
  const suspiciousPatterns: RegExp[] = [
    // SQL injection
    /(\b(union|select|insert|delete|drop|create|alter|exec|execute|script|javascript)\b)/i,
    // XSS attempts
    /(<script|javascript:|onload=|onerror=|onclick=|onmouseover=|onfocus=)/i,
    // Path traversal
    /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/i,
    // Command injection
    /(\b(cat|ls|pwd|whoami|id|uname|curl|wget|nc|netcat|bash|sh|cmd|powershell)\b)/i,
    // Common attack tools and scanners
    /(sqlmap|nikto|nmap|masscan|zap|burp|dirbuster|gobuster|wfuzz|hydra)/i,
    // File inclusion attempts
    /(\/etc\/passwd|\/proc\/|\/sys\/|\/dev\/|boot\.ini|win\.ini)/i,
    // PHP vulnerabilities
    /(php:\/\/|file:\/\/|ftp:\/\/|gopher:\/\/|dict:\/\/)/i,
  ];

  const fullContent = `${url} ${userAgent} ${referer}`;

  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fullContent)) {
      return true;
    }
  }

  // Check for suspicious user agents
  const suspiciousUserAgents: string[] = [
    'python-requests',
    'curl/',
    'wget/',
    'scanner',
    'crawler',
    'spider',
    'bot',
    'scraper',
    'hack',
    'exploit',
    'sqlmap',
    'nikto'
  ];
  
  const lowerUserAgent = userAgent.toLowerCase();
  if (suspiciousUserAgents.some(ua => lowerUserAgent.includes(ua))) {
    return true;
  }

  // Check for empty or very short user agents (often bots)
  if (userAgent.length < 10 && request.method !== 'OPTIONS') {
    return true;
  }

  // Check for rapid identical requests
  const requestHash = `${request.method}:${new URL(url).pathname}:${userAgent.substring(0, 50)}`;
  const hashKey = `${ip}:${requestHash}`;
  const hashCount = suspiciousIPs.get(hashKey) ?? 0;
  
  if (hashCount > 8) { // Same request more than 8 times rapidly
    return true;
  }
  
  suspiciousIPs.set(hashKey, hashCount + 1);
  
  // Clean up hash tracking (keep for 5 minutes)
  setTimeout(() => {
    suspiciousIPs.delete(hashKey);
  }, 5 * 60 * 1000);
  
  return false;
}

/**
 * Log activities with proper typing
 */
function logActivity(type: LogType, ip: string, message: string, details: string = ''): void {
  if (config.enableLogging) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${ip}: ${message} ${details}`);
  }
}

/**
 * Add IP to temporary blacklist
 */
function addToBlacklist(ip: string, duration: number = 15 * 60 * 1000): void {
  blacklistedIPs.add(ip);
  logActivity('SECURITY', ip, 'Added to blacklist', `duration: ${duration}ms`);
  
  // Remove from blacklist after duration
  setTimeout(() => {
    blacklistedIPs.delete(ip);
    logActivity('SECURITY', ip, 'Removed from blacklist');
  }, duration);
}

/**
 * Create blocked response with proper headers
 */
function createBlockedResponse(reason: string, statusCode: number = 429): NextResponse {
  const response = new NextResponse(
    JSON.stringify({
      error: 'Request blocked',
      message: 'Your request has been blocked due to security policies',
      reason: reason,
      code: statusCode,
      timestamp: new Date().toISOString()
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Window': (config.windowMs / 1000).toString(),
        'X-RateLimit-Remaining': '0',
        'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );

  return addSecurityHeaders(response);
}

/**
 * Add comprehensive security headers
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Rate limiting headers
  response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  response.headers.set('X-RateLimit-Window', (config.windowMs / 1000).toString());
  
  return response;
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);
  const method = request.method;
  const userAgent = request.headers.get('user-agent') ?? 'Unknown';

  // Skip protection for excluded paths
  if (!shouldProtectPath(pathname)) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  try {
    // 1. Check if IP is blacklisted
    if (isBlacklisted(clientIP)) {
      logActivity('BLOCK', clientIP, 'IP blacklisted', pathname);
      return createBlockedResponse('IP blacklisted', 403);
    }

    // 2. Skip other checks for whitelisted IPs
    if (isWhitelisted(clientIP)) {
      logActivity('ACCESS', clientIP, `${method} ${pathname}`, 'WHITELISTED');
      const response = NextResponse.next();
      return addSecurityHeaders(response);
    }

    // 3. Check allowed methods
    if (!config.allowedMethods.includes(method)) {
      logActivity('BLOCK', clientIP, 'Method not allowed', `${method} ${pathname}`);
      return createBlockedResponse('Method not allowed', 405);
    }

    // 4. Check payload size for requests with body
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > config.maxPayloadSize) {
      logActivity('BLOCK', clientIP, 'Payload too large', `${contentLength} bytes`);
      return createBlockedResponse('Payload too large', 413);
    }

    // 5. Check for suspicious patterns
    if (isSuspiciousRequest(request, clientIP)) {
      logActivity('SECURITY', clientIP, 'Suspicious request detected', `${method} ${pathname}`);
      addToBlacklist(clientIP, 30 * 60 * 1000); // 30 minutes for suspicious activity
      return createBlockedResponse('Suspicious activity detected', 403);
    }

    // 6. Rate limiting - per second
    if (!checkPerSecondLimit(clientIP)) {
      logActivity('BLOCK', clientIP, 'Rate limit exceeded (per second)', pathname);
      return createBlockedResponse('Rate limit exceeded', 429);
    }

    // 7. Rate limiting - per window
    if (!checkWindowLimit(clientIP)) {
      logActivity('BLOCK', clientIP, 'Rate limit exceeded (per window)', pathname);
      addToBlacklist(clientIP, 10 * 60 * 1000); // 10 minutes for rate limit violation
      return createBlockedResponse('Rate limit exceeded', 429);
    }

    // 8. Log legitimate request
    logActivity('ACCESS', clientIP, `${method} ${pathname}`, userAgent.substring(0, 100));

    // 9. Allow request and add security headers
    const response = NextResponse.next();
    
    // Add rate limit info to successful responses
    const windowStart = Math.floor(Date.now() / config.windowMs) * config.windowMs;
    const windowKey = `${clientIP}:${windowStart}`;
    const currentCount = requestCounts.get(windowKey) ?? 0;
    const remaining = Math.max(0, config.maxRequests - currentCount);
    
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil((windowStart + config.windowMs) / 1000).toString());
    
    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Middleware error:', error);
    logActivity('INFO', clientIP, 'Middleware error - allowing request', error instanceof Error ? error.message : 'Unknown error');
    
    // Fail safely - allow request through
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }
}