// routes/profileRoute.js
import express from 'express'
import {
    getProfile, updateProfile, uploadAvatar,
    changePassword, addAddress, updateAddress, deleteAddress
} from '../controllers/profileController.js'
import authUser from '../middleware/auth.js'
import upload from '../middleware/multer.js'    // ← your existing multer

const profileRouter = express.Router()

profileRouter.get('/',                      authUser, getProfile)
profileRouter.put('/',                      authUser, updateProfile)
profileRouter.post('/avatar',               upload.single('avatar'), authUser, uploadAvatar)
profileRouter.put('/password',              authUser, changePassword)
profileRouter.post('/address',              authUser, addAddress)
profileRouter.put('/address/:addressId',    authUser, updateAddress)
profileRouter.delete('/address/:addressId', authUser, deleteAddress)

export default profileRouter