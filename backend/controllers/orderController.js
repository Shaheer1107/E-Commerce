import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import crypto from "crypto"

const stripe    = new Stripe(process.env.STRIPE_SECRET_KEY)

// ─── Shared validation ────────────────────────────────────────────────────────
const validateOrderBody = ({ userId, items, amount, address }) => {
    if (!userId)                       return "User ID is required"
    if (!items || items.length === 0)  return "Order must contain at least one item"
    if (!amount || amount <= 0)        return "Invalid order amount"
    if (!address?.firstName)           return "Delivery address is required"
    return null
}

// ─── COD ──────────────────────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body
        const err = validateOrderBody({ userId, items, amount, address })
        if (err) return res.status(400).json({ success: false, message: err })

        const newOrder = await orderModel.create({
            userId, items, amount, address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        })

        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: "Order Placed", orderId: newOrder._id })
    }
    catch (error) {
        console.error("placeOrder error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── STRIPE ───────────────────────────────────────────────────────────────────
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body
        const err = validateOrderBody({ userId, items, amount, address })
        if (err) return res.status(400).json({ success: false, message: err })

        const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173"

        const newOrder = await orderModel.create({
            userId, items, amount, address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        })

        const line_items = items.map((item) => ({
            price_data: {
                currency:     process.env.CURRENCY || "usd",
                product_data: { name: item.name },
                unit_amount:  Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }))

        line_items.push({
            price_data: {
                currency:     process.env.CURRENCY || "usd",
                product_data: { name: "Delivery Fee" },
                unit_amount:  200,
            },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({ success: true, session_url: session.url })
    }
    catch (error) {
        console.error("placeOrderStripe error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body
        if (!orderId || !userId) return res.status(400).json({ success: false, message: "Missing orderId or userId" })

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true, message: "Payment Successful" })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Payment Cancelled" })
        }
    }
    catch (error) {
        console.error("verifyStripe error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}



// ─── USER: view their orders (order tracking) ─────────────────────────────────
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel
            .find({ userId })
            .sort({ date: -1 })   // newest first
            .select('items amount address status paymentMethod payment date')

        res.json({ success: true, orders })
    }
    catch (error) {
        console.error("userOrders error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── USER: cancel their own order ─────────────────────────────────────────────
// Only allowed before the order has been shipped
const cancelOrder = async (req, res) => {
    try {
        const { orderId, userId } = req.body
        if (!orderId) return res.status(400).json({ success: false, message: "Order ID is required" })

        const order = await orderModel.findById(orderId)
        if (!order) return res.status(404).json({ success: false, message: "Order not found" })

        // ✅ Security: confirm the order actually belongs to this user
        if (order.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorised to cancel this order" })
        }

        if (["Shipped", "Out for Delivery", "Delivered"].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel an order that is already ${order.status}`
            })
        }

        await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" })
        res.json({ success: true, message: "Order cancelled successfully" })
    }
    catch (error) {
        console.error("cancelOrder error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── ADMIN: all orders with pagination ───────────────────────────────────────
const allOrders = async (req, res) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)   || 1)
        const limit = Math.min(100, parseInt(req.query.limit) || 20)
        const skip  = (page - 1) * limit

        const [orders, total] = await Promise.all([
            orderModel.find({}).sort({ date: -1 }).skip(skip).limit(limit),
            orderModel.countDocuments()
        ])

        res.json({
            success: true,
            orders,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        })
    }
    catch (error) {
        console.error("allOrders error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── ADMIN: update order status ───────────────────────────────────────────────
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status are required" })
        }

        const validStatuses = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"]
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            })
        }

        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        if (!order) return res.status(404).json({ success: false, message: "Order not found" })

        res.json({ success: true, message: "Order status updated", order })
    }
    catch (error) {
        console.error("updateStatus error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export {
    placeOrder,
    placeOrderStripe,  verifyStripe,
    userOrders, cancelOrder,
    allOrders, updateStatus
}