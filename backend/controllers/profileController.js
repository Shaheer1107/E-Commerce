// controllers/profileController.js
import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose' 

// ─── GET Profile ──────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
    try {
        const userId = req.body.userId

        const user = await userModel
            .findById(userId)
            .select('-password -cartData -loginAttempts -lockUntil')

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const totalOrders = await orderModel.countDocuments({ userId })

        // ✅ Convert string → ObjectId for aggregate pipeline
        const spentResult = await orderModel.aggregate([
            {
                $match: {
                    userId:  new mongoose.Types.ObjectId(userId),
                    payment: true
                }
            },
            {
                $group: {
                    _id:   null,
                    total: { $sum: '$amount' }
                }
            }
        ])

        res.json({
            success: true,
            user: {
                ...user.toObject(),
                stats: {
                    totalOrders,
                    totalSpent:  spentResult[0]?.total || 0,
                    memberSince: user.createdAt,
                }
            }
        })
    } catch (error) {
        console.error('getProfile error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}
// ─── UPDATE Profile ───────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone } = req.body

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' })
        }
        if (phone && !/^\+?[\d\s\-\(\)]{7,15}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Invalid phone number' })
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { name: name.trim(), phone: phone?.trim() || '' },
            { new: true, select: '-password -cartData -loginAttempts -lockUntil' }
        )

        res.json({ success: true, user, message: 'Profile updated successfully' })
    } catch (error) {
        console.error('updateProfile error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── UPLOAD Avatar ────────────────────────────────────────────────────────────
// Flow: multer saves to disk → we upload to Cloudinary → save URL to DB
const uploadAvatar = async (req, res) => {
    try {
        const { userId } = req.body

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' })
        }

        // Delete old avatar from Cloudinary if one exists
        const user = await userModel.findById(userId)
        if (user.avatarId) {
            try {
                await cloudinary.uploader.destroy(user.avatarId)
            } catch (e) {
                console.warn('Could not delete old avatar:', e.message)
            }
        }

        // Upload new avatar — face-crop to square, stored in avatars folder
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder:         'textiles/avatars',
            public_id:      `avatar_${userId}`,     // consistent ID per user
            overwrite:      true,                    // replaces previous upload
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' }
            ],
        })

        await userModel.findByIdAndUpdate(userId, {
            avatar:   result.secure_url,
            avatarId: result.public_id,
        })

        res.json({
            success: true,
            avatar:  result.secure_url,
            message: 'Profile picture updated'
        })
    } catch (error) {
        console.error('uploadAvatar error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── CHANGE Password ──────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both fields are required' })
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
        }
        if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must contain letters and numbers' })
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ success: false, message: 'New password must be different from current' })
        }

        const user = await userModel.findById(userId)
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' })
        }

        const salt   = await bcrypt.genSalt(12)
        const hashed = await bcrypt.hash(newPassword, salt)
        await userModel.findByIdAndUpdate(userId, { password: hashed })

        res.json({ success: true, message: 'Password changed successfully' })
    } catch (error) {
        console.error('changePassword error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── ADD Address ──────────────────────────────────────────────────────────────
const addAddress = async (req, res) => {
    try {
        const { userId, label, firstName, lastName, street,
                city, state, zipcode, country, phone, isDefault } = req.body

        if (!firstName || !lastName || !street || !city || !state || !zipcode || !country || !phone) {
            return res.status(400).json({ success: false, message: 'All address fields are required' })
        }

        const user = await userModel.findById(userId)

        // First address is always default; or honour the isDefault flag
        const shouldBeDefault = isDefault || user.addresses.length === 0
        if (shouldBeDefault) {
            user.addresses.forEach(addr => { addr.isDefault = false })
        }

        user.addresses.push({
            label: label || 'Home',
            firstName, lastName, street,
            city, state, zipcode, country, phone,
            isDefault: shouldBeDefault,
        })

        await user.save()
        res.json({ success: true, addresses: user.addresses, message: 'Address added' })
    } catch (error) {
        console.error('addAddress error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── UPDATE Address ───────────────────────────────────────────────────────────
const updateAddress = async (req, res) => {
    try {
        const { userId, label, firstName, lastName, street,
                city, state, zipcode, country, phone, isDefault } = req.body
        const { addressId } = req.params

        const user = await userModel.findById(userId)
        const addr = user.addresses.id(addressId)

        if (!addr) {
            return res.status(404).json({ success: false, message: 'Address not found' })
        }

        if (isDefault) {
            user.addresses.forEach(a => { a.isDefault = false })
        }

        Object.assign(addr, {
            label, firstName, lastName, street,
            city, state, zipcode, country, phone, isDefault
        })

        await user.save()
        res.json({ success: true, addresses: user.addresses, message: 'Address updated' })
    } catch (error) {
        console.error('updateAddress error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── DELETE Address ───────────────────────────────────────────────────────────
const deleteAddress = async (req, res) => {
    try {
        const { userId }    = req.body
        const { addressId } = req.params

        const user       = await userModel.findById(userId)
        const addrIndex  = user.addresses.findIndex(a => a._id.toString() === addressId)

        if (addrIndex === -1) {
            return res.status(404).json({ success: false, message: 'Address not found' })
        }

        const wasDefault = user.addresses[addrIndex].isDefault
        user.addresses.splice(addrIndex, 1)

        // Promote first remaining address to default if the deleted one was default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true
        }

        await user.save()
        res.json({ success: true, addresses: user.addresses, message: 'Address deleted' })
    } catch (error) {
        console.error('deleteAddress error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export {
    getProfile, updateProfile, uploadAvatar,
    changePassword, addAddress, updateAddress, deleteAddress
}