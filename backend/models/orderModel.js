import mongoose from 'mongoose'

// ✅ Typed sub-schema for each item in the order
//    Original was: items: { type: Array } — no validation at all
//    Now mongoose validates the shape of every item before saving
const orderItemSchema = new mongoose.Schema({
    _id:      false,           // ✅ Don't auto-generate _id for sub-documents
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size:     { type: String, required: true },
    image:    { type: [String] },
}, { _id: false })

// ✅ Typed sub-schema for delivery address
//    Original was: address: { type: Object } — zero validation
const addressSchema = new mongoose.Schema({
    _id:       false,
    firstName: { type: String, required: true },
    lastName:  { type: String },
    email:     { type: String },
    street:    { type: String },
    city:      { type: String },
    state:     { type: String },
    zipcode:   { type: String },
    country:   { type: String },
    phone:     { type: String },
}, { _id: false })

const orderSchema = new mongoose.Schema({
    // ✅ ObjectId ref instead of plain String
    //    This enables .populate('userId') later if you need user details on an order
    //    Also enforces that only valid MongoDB IDs can be stored here
    userId: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'user',
        required: true
    },

    items:   { type: [orderItemSchema], required: true },
    amount:  { type: Number, required: true },
    address: { type: addressSchema, required: true },

    status: {
        type:     String,
        required: true,
        default:  'Order Placed',
        enum:     ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
    },

    paymentMethod: { type: String, required: true },
    payment:       { type: Boolean, required: true, default: false },

    // ✅ Changed from Number to Date — Date is the correct type for timestamps
    //    Number (unix ms) is technically fine but Date gives you .toISOString(),
    //    date comparison operators, and better readability in MongoDB Compass
    date: { type: Date, required: true, default: Date.now }

}, {
    timestamps: true
})

// ✅ Compound index on userId + date — makes "fetch my orders, newest first" fast
orderSchema.index({ userId: 1, date: -1 })

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel