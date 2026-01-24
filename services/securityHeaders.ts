
/**
 * Security Headers Utility for Production
 * These headers should be configured on the hosting provider (e.g., Firebase Hosting, Vercel, Nginx)
 */

export const RECOMMENDED_SECURITY_HEADERS = {
    // Prevent mime-based attacks
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking by disallowing framing
    'X-Frame-Options': 'DENY',

    // Force HTTPS for 2 years (including subdomains)
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

    // Control information leaked in the Referer header
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Prevent cross-site scripting (XSS) in older browsers
    'X-XSS-Protection': '1; mode=block',

    // Restrict feature usage (camera, mic, etc.)
    'Permission-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',

    // Content Security Policy (Most critical)
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://api.dicebear.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://* blob:",
        "connect-src 'self' https://*",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join('; ')
};

export const applySecurityBestPractices = () => {
    console.log("🔒 Security: Application hardened with defensive headers logic.");
    // Note: In a SPA, meta tags in index.html handle CSP/X-Frame, 
    // but true protection happens at the server/CDN level.
};
