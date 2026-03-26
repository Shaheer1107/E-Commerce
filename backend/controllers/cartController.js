import userModel from "../models/userModel.js"

// ─── Add to cart ──────────────────────────────────────────────────────────────
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        if (!itemId || !size) {
            // ✅ 400 Bad Request — client sent incomplete data
            return res.status(400).json({ success: false, message: "Item ID and size are required" })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            // ✅ 404 Not Found — the user doesn't exist
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1
        } else {
            cartData[itemId] = { [size]: 1 }
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        // ✅ 200 is correct here — item was successfully added
        res.json({ success: true, message: "Product added to cart successfully" })
    }
    catch (error) {
        // ✅ console.error, not console.log
        console.error("addToCart error:", error)
        // ✅ 500 Internal Server Error — something unexpected happened server-side
        res.status(500).json({ success: false, message: "Server error" })
    }
}

// ─── Update cart ──────────────────────────────────────────────────────────────
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body

        if (!itemId || !size || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Item ID, size, and quantity are required" })
        }

        // ✅ Validate quantity is a non-negative number
        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ success: false, message: "Quantity must be a non-negative number" })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData

        if (quantity === 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][size]
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId]
                }
            }
        } else {
            if (!cartData[itemId]) cartData[itemId] = {}
            cartData[itemId][size] = quantity
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart updated successfully" })
    }
    catch (error) {
        console.error("updateCart error:", error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

// ─── Get cart ─────────────────────────────────────────────────────────────────
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.json({ success: true, cartData: userData.cartData })
    }
    catch (error) {
        console.error("getUserCart error:", error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export { addToCart, updateCart, getUserCart }