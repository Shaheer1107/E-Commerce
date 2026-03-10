import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name:        { type: String,   required: true, trim: true },
    price:       { type: Number,   required: true, min: 0 },  // ✅ min:0 prevents negative prices
    description: { type: String,   required: true },
    images:      { type: [String], required: true },
    category:    { type: String,   required: true },
    subCategory: { type: String,   required: true },
    sizes:       { type: Array,    required: true },
    bestseller:  { type: Boolean,  default: false },
    date:        { type: Number,   required: true }
}, {
    timestamps: true   // ✅ adds createdAt + updatedAt
})

// ✅ Indexes for the most common query patterns:
productSchema.index({ category: 1 })           // filtering by category in shop page
productSchema.index({ bestseller: 1 })         // homepage bestseller section
productSchema.index({ name: 'text', description: 'text' })  // enables ?search= full-text search

const productModel = mongoose.models.product || mongoose.model("product", productSchema)
export default productModel