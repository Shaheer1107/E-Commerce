import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId:        { type: String, required: true },
    items:         { type: Array,  required: true },
    amount:        { type: Number, required: true },
    address:       { type: Object, required: true },
    status: {
        type: String,
        required: true,
        default: 'Order Placed',
        enum: ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
        // ✅ Added "Cancelled" — users can now cancel orders
        // ✅ enum prevents any arbitrary string being saved as a status
    },
    paymentMethod: { type: String, required: true },
    payment:       { type: Boolean, required: true, default: false },
    date:          { type: Date, required: true }
}, {
    timestamps: true   // ✅ adds createdAt + updatedAt automatically
})

// ✅ Compound index on userId + date — makes "fetch my orders" fast
//    instead of scanning the entire collection
orderSchema.index({ userId: 1, date: -1 })

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel