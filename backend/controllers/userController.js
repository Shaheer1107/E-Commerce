import userModel from "../models/userModel.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const MAX_LOGIN_ATTEMPTS = 5
const LOCK_DURATION_MS   = 15 * 60 * 1000   // 15 minutes

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'   // ✅ tokens now expire (were permanent before)
    })
}

// ─── Login ────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" })
        }

        const user = await userModel.findOne({ email: email.toLowerCase().trim() })

        // ✅ Generic message — never reveal whether the email exists (stops email harvesting)
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }

        // ✅ Account lockout check
        if (user.isLocked) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000)
            return res.status(423).json({
                success: false,
                message: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            // ✅ Track failed attempts — lock account if threshold reached
            const attempts = user.loginAttempts + 1
            const update   = attempts >= MAX_LOGIN_ATTEMPTS
                ? { loginAttempts: attempts, lockUntil: new Date(Date.now() + LOCK_DURATION_MS) }
                : { loginAttempts: attempts }

            await userModel.findByIdAndUpdate(user._id, update)
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }

        // ✅ Successful login — reset failed attempt counter
        await userModel.findByIdAndUpdate(user._id, { loginAttempts: 0, lockUntil: null })

        const token = createToken(user._id)
        res.json({ success: true, token })
    }
    catch (error) {
        console.error("loginUser error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── Register ─────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" })
        }
        // ✅ Enforce password contains at least one letter and one number
        if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            return res.status(400).json({ success: false, message: "Password must contain letters and numbers" })
        }

        const exists = await userModel.findOne({ email: email.toLowerCase().trim() })
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" })
        }

        // ✅ 12 salt rounds (was 10) — stronger hashing, negligible performance difference
        const salt           = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user  = await userModel.create({
            name:     name.trim(),
            email:    email.toLowerCase().trim(),
            password: hashedPassword
        })

        const token = createToken(user._id)
        res.status(201).json({ success: true, token })
    }
    catch (error) {
        console.error("registerUser error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" })
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // ✅ Admin tokens expire in 1d (shorter than user tokens)
            const token = jwt.sign(email + password, process.env.JWT_SECRET, {
                expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1d'
            })
            res.json({ success: true, token })
        } else {
            // ✅ 500ms delay on failure — makes timing/brute-force attacks harder
            await new Promise(r => setTimeout(r, 500))
            res.status(401).json({ success: false, message: "Invalid email or password" })
        }
    }
    catch (error) {
        console.error("adminLogin error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin }