import userRouter from '../routes/userRoute.js'
import productRouter from '../routes/productRoute.js'
import cartRouter from '../routes/cartRoute.js'
import orderRouter from '../routes/orderRoute.js'
import profileRouter from '../routes/profileRoute.js'
import { authLimiter, profileLimiter } from '../config/rateLimiter.js'

const applyRoutes = (app) => {
    // ✅ Profile MUST come before /api/user to avoid authLimiter
    app.use('/api/user/profile', profileLimiter, profileRouter)
    app.use('/api/user',         authLimiter,    userRouter)
    app.use('/api/product',      productRouter)
    app.use('/api/cart',         cartRouter)
    app.use('/api/order',        orderRouter)

    app.get('/', (req, res) => res.json({ success: true, message: 'API is running' }))
}

export default applyRoutes