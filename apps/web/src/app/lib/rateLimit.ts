
export const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
export const RATE_LIMIT = {
  maxRequests: 3, // Max requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxPerEmail: 1, // Max requests per email per day
  emailWindowMs: 24 * 60 * 60 * 1000, // 24 hours
};

export function getRateLimitKey(ip: string, type: 'ip' | 'email', identifier?: string): string {
  return type === 'ip' ? `ip:${ip}` : `email:${identifier}`;
}

export function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
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

export function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto-cleanup every 30 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(cleanupRateLimit, 30 * 60 * 1000);
}