import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

//App config
const app = express()
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();
// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.get('/', (req, res) => {
    res.send("API working")
})

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" })
})

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err)
    res.status(500).json({ success: false, message: "Internal server error" })
})

app.listen(port, ()=> console.log('Server started on port: ' + port));