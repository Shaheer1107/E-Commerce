const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim().replace(/\/$/, ''))

const corsOptions = {
    origin: (origin, callback) => {
        if (
            !origin ||
            allowedOrigins.includes(origin.replace(/\/$/, '')) ||
            origin.includes('localhost')
        ) {
            return callback(null, true)
        }
        callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'token'],
    credentials: true,
}

export default corsOptions