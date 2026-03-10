import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"

// Initialize Stripe with your secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// ─── COD ────────────────────────────────────────────────────────────────────

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed" })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ─── STRIPE ─────────────────────────────────────────────────────────────────

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        // The URLs Stripe will redirect to after payment succeeds or is cancelled
        const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173"

        // Step 1: Save the order in DB first, with payment: false
        // We'll flip it to true only after Stripe confirms the payment
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Step 2: Build line_items — Stripe needs a name + price + quantity for each item
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",              // Change to "inr", "gbp", etc. if needed
                product_data: {
                    name: item.name,
                },
                // Stripe expects the price in the SMALLEST currency unit
                // e.g. for USD: dollars x 100 = cents  ($10.00 = 1000)
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }))

        // Add delivery fee as a separate line item
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Delivery Fee" },
                unit_amount: 200,             // $2.00 delivery fee — change as needed
            },
            quantity: 1,
        })

        // Step 3: Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            // After payment, Stripe redirects here — we pass the orderId so we can verify it
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        // Step 4: Send the Stripe session URL back to the frontend
        // The frontend will redirect the user to this URL to complete payment
        res.json({ success: true, session_url: session.url })

    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ─── STRIPE VERIFY ──────────────────────────────────────────────────────────
// Called by the frontend after Stripe redirects back to your site
// Checks if payment was successful and either confirms or deletes the order

const verifyStripe = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body

        if (success === "true") {
            // Payment confirmed — mark order as paid and clear the user's cart
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true, message: "Payment Successful" })
        } else {
            // Payment was cancelled — delete the pending order
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Payment Cancelled" })
        }
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ─── RAZORPAY (placeholder) ──────────────────────────────────────────────────

const placeOrderRazorpay = async (req, res) => {
    try {
        res.json({ success: false, message: "Razorpay not yet configured." })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        const validStatuses = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered"]
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` })
        }

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Order Status Updated" })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, placeOrderRazorpay, placeOrderStripe, verifyStripe, allOrders, updateStatus, userOrders }