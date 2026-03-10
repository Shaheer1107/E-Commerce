import express from 'express'
import {
    placeOrder,
    placeOrderStripe,
    verifyStripe,         
    allOrders,
    updateStatus,
    userOrders
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)

// ✅ New: Stripe verification — called by frontend after redirect back from Stripe
orderRouter.post('/verifyStripe', authUser, verifyStripe)

// User features
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter