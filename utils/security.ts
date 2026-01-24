
/**
 * Advanced Defensive Security Utilities
 * Implements sanitization, rate-limiting, and injection protection.
 */

// 1. Robust Input Sanitization
export const sanitizeInput = (input: string, maxLength: number = 255): string => {
    if (!input) return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Basic tag stripping
        .replace(/javascript:/gi, '') // Prevent URI schemes
        .replace(/on\w+=/gi, '') // Prevent event handler attributes
        .slice(0, maxLength);
};

// 2. Client-Side Rate Limiter (Preventing UI Spam)
const requestCounts = new Map<string, { count: number, firstRequest: number }>();

export const checkRateLimit = (action: string, limit: number = 5, windowMs: number = 10000): boolean => {
    const now = Date.now();
    const entry = requestCounts.get(action);

    if (!entry || (now - entry.firstRequest) > windowMs) {
        requestCounts.set(action, { count: 1, firstRequest: now });
        return true;
    }

    if (entry.count >= limit) {
        console.error(`🛡️ Security: Rate limit exceeded for action "${action}"`);
        return false;
    }

    entry.count++;
    return true;
};

// 3. Automated Error Logging (Honeypot/SIEM Simulation)
export const logSecurityEvent = (event: string, severity: 'LOW' | 'MEDIUM' | 'HIGH') => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] 🛡️ SECURITY EVENT [${severity}]: ${event}`);
    // In production, this would send data to a SIEM like Google Cloud Logging
};
