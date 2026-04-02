import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        // ✅ Fixed: token payload is now { data: email+password } (an object)
        //    Previously was a plain string, which broke expiresIn AND this check
        if (token_decode.data !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ success: false, message: "Not Authorized. Login Again" })
        }

        next()
    }
    catch (error) {
        console.error("adminAuth error:", error)
        res.status(401).json({ success: false, message: error.message })
    }
}

export default adminAuth