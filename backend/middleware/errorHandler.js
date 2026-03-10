// 404 — no route matched
export const notFound = (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
}

// Global error handler — must have 4 params for Express to treat it as error middleware
// Never leaks stack traces to the client in production
export const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err)
    const statusCode = err.statusCode || 500
    const message    = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    res.status(statusCode).json({ success: false, message })
}