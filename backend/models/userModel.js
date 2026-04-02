// models/userModel.js
import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    label:     { type: String, default: 'Home' },
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    street:    { type: String, required: true },
    city:      { type: String, required: true },
    state:     { type: String, required: true },
    zipcode:   { type: String, required: true },
    country:   { type: String, required: true },
    phone:     { type: String, required: true },
    isDefault: { type: Boolean, default: false },
}, { _id: true })

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },

    // ── New profile fields ──
    phone:     { type: String, default: '' },
    avatar:    { type: String, default: '' },   // Cloudinary URL
    avatarId:  { type: String, default: '' },   // Cloudinary public_id for deletion
    addresses: [addressSchema],

    // ── Lockout (existing) ──
    loginAttempts: { type: Number, default: 0 },
    lockUntil:     { type: Date,   default: null },
}, {
    minimize:   false,
    timestamps: true
})

userSchema.virtual('isLocked').get(function () {
    return this.lockUntil && this.lockUntil > Date.now()
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)
export default userModel