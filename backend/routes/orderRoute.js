import express from 'express'
import {
    placeOrder,
    placeOrderStripe,   verifyStripe,
    userOrders,         cancelOrder,
    allOrders,          updateStatus,
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser  from '../middleware/auth.js'

const orderRouter = express.Router()

// ─── Admin ────────────────────────────────────────────────────────────────────
orderRouter.post('/list',   adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// ─── Place order ──────────────────────────────────────────────────────────────
orderRouter.post('/place',    authUser, placeOrder)
orderRouter.post('/stripe',   authUser, placeOrderStripe)

// ─── Verify payment ───────────────────────────────────────────────────────────
orderRouter.post('/verifyStripe',   authUser, verifyStripe)

// ─── User ─────────────────────────────────────────────────────────────────────
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/cancel',     authUser, cancelOrder)

export default orderRouter