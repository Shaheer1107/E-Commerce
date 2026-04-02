import rateLimit from 'express-rate-limit'

// Global limiter — applied to every route
// 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
})

// Profile limiter — authenticated actions like password change, address edits
// 60 requests per 15 minutes is plenty for legitimate use
export const profileLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
})

// Auth limiter — applied only to /api/user routes
// 10 attempts per 15 minutes per IP — prevents brute force on login/register
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts, please try again later.' },
})