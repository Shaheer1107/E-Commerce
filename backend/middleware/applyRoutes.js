import userRouter from '../routes/userRoute.js'
import productRouter from '../routes/productRoute.js'
import cartRouter from '../routes/cartRoute.js'
import orderRouter from '../routes/orderRoute.js'
import { authLimiter } from '../config/rateLimiter.js'

const applyRoutes = (app) => {
    app.use('/api/user',    authLimiter, userRouter)   // Stricter rate limit on auth
    app.use('/api/product', productRouter)
    app.use('/api/cart',    cartRouter)
    app.use('/api/order',   orderRouter)

    app.get('/', (req, res) => res.json({ success: true, message: 'API is running' }))
}

export default applyRoutes