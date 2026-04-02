import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import corsOptions from '../config/cors.js'
import { globalLimiter } from '../config/rateLimiter.js'

// ─── Log file setup ───────────────────────────────────────────────────────────
// __dirname isn't available in ES modules — this recreates it
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// Logs folder sits at the project root: backend/logs/
const logsDir = path.join(__dirname, '..', 'logs')

// Create the logs folder if it doesn't exist yet
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
}

// ✅ Two separate log files:
//    access.log  — every HTTP request (morgan)
//    error.log   — only 4xx and 5xx responses
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }   // 'a' = append, so logs survive server restarts
)

const errorLogStream = fs.createWriteStream(
    path.join(logsDir, 'error.log'),
    { flags: 'a' }
)

// Custom morgan token that writes errors to error.log separately
morgan.token('error-logger', (req, res) => {
    if (res.statusCode >= 400) {
        const errorLine = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode}\n`
        errorLogStream.write(errorLine)
    }
    return ''
})

const applyMiddlewares = (app) => {
    app.use(helmet())
    app.use(cors(corsOptions))
    app.use(globalLimiter)

    if (process.env.NODE_ENV === 'production') {
        // Production: write combined logs (IP, method, status, response time) to file only
        app.use(morgan('combined', { stream: accessLogStream }))
    } else {
        // Development: colourful logs on terminal AND write to file simultaneously
        app.use(morgan('dev'))
        app.use(morgan('combined', { stream: accessLogStream }))
    }

    // Attach the error logger token (writes 4xx/5xx lines to error.log)
    app.use(morgan(':error-logger', { stream: { write: () => {} } }))

    app.use(compression())
    app.use(express.json({ limit: '10kb' }))
    app.use(express.urlencoded({ extended: true, limit: '10kb' }))
}

export default applyMiddlewares