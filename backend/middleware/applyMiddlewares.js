import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import corsOptions from '../config/cors.js'
import { globalLimiter } from '../config/rateLimiter.js'

const applyMiddlewares = (app) => {
    app.use(helmet())                                                          // Security headers
    app.use(cors(corsOptions))                                                 // CORS
    app.use(globalLimiter)                                                     // Rate limiting
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')) // Logging
    app.use(compression())                                                     // Gzip
    app.use(express.json({ limit: '10kb' }))                                   // Body parsing
    app.use(express.urlencoded({ extended: true, limit: '10kb' }))
}

export default applyMiddlewares