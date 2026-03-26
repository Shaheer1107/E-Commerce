import express from 'express'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import applyMiddlewares from './middleware/applyMiddlewares.js'
import applyRoutes from './middleware/applyRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app  = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

applyMiddlewares(app)

applyRoutes(app)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`)
})