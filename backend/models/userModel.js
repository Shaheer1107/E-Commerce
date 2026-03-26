import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },

    // ✅ Account lockout — locks account after 5 failed login attempts for 15 min
    //    Protects against brute force even if the rate limiter is somehow bypassed
    loginAttempts: { type: Number, default: 0 },
    lockUntil:     { type: Date,   default: null },
}, {
    minimize:   false,   // keeps empty cartData: {} from being stripped
    timestamps: true     // ✅ adds createdAt + updatedAt
})


// Virtual helper — returns true if account is currently locked
userSchema.virtual('isLocked').get(function () {
    return this.lockUntil && this.lockUntil > Date.now()
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)
export default userModel