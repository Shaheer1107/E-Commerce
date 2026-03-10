import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        if (!itemId || !size) {
            return res.json({ success: false, message: "Item ID and size are required" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Product added to cart successfully" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        if (!itemId || !size || quantity === undefined) {
            return res.json({ success: false, message: "Item ID, size, and quantity are required" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;

        if (quantity === 0) {
            // ✅ If quantity is 0, remove the size entry from the cart
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get user cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;
        res.json({ success: true, cartData });   // ✅ Fixed: was returning cart under 'message' field instead of 'cartData'
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart }