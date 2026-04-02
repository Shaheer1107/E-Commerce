import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            // ✅ 401 = "you didn't provide credentials"
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' })
        }

        const token_decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.body.userId = token_decoded.id

        next()
    }
    catch (error) {
        // ✅ console.error (not console.log) — goes to stderr, filterable in production logs
        console.error('authUser error:', error)

        // ✅ 401 for all token failures (expired, tampered, malformed)
        // ✅ Never expose error.message — it can leak internal details like "jwt expired"
        //    Use a fixed message instead
        res.status(401).json({ success: false, message: 'Not Authorized. Login Again' })
    }
}

export default authUser