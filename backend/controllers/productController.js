import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js'

// ─── Add product ─────────────────────────────────────────────────────────────
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        if (!name || !description || !price || !category || !subCategory || !sizes) {
            return res.status(400).json({ success: false, message: "All product fields are required" })
        }
        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({ success: false, message: "Price must be a positive number" })
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required" })
        }

        const images = ['image1', 'image2', 'image3', 'image4']
            .map(key => req.files[key]?.[0])
            .filter(Boolean)

        const imagesUrl = await Promise.all(
            images.map(item =>
                cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                    .then(r => r.secure_url)
            )
        )

        await productModel.create({
            name:        name.trim(),
            description,
            price:       Number(price),
            category,
            subCategory,
            sizes:       JSON.parse(sizes),
            bestseller:  bestseller === "true",
            images:      imagesUrl,
            date:        Date.now(),
        })

        res.status(201).json({ success: true, message: "Product Added" })
    }
    catch (error) {
        console.error("addProduct error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── List products ────────────────────────────────────────────────────────────
// Supports optional query params:
//   ?page=1&limit=20          — pagination
//   ?category=Men             — filter by category
//   ?subCategory=Topwear      — filter by subCategory
//   ?bestseller=true          — only bestsellers
//   ?search=shirt             — full-text search on name + description
const listProducts = async (req, res) => {
    try {
        const page   = Math.max(1, parseInt(req.query.page)   || 1)
        const limit  = Math.min(100, parseInt(req.query.limit) || 20)
        const skip   = (page - 1) * limit
        const filter = {}

        if (req.query.category)    filter.category    = req.query.category
        if (req.query.subCategory) filter.subCategory = req.query.subCategory
        if (req.query.bestseller)  filter.bestseller  = req.query.bestseller === 'true'
        if (req.query.search)      filter.$text       = { $search: req.query.search }

        const [products, total] = await Promise.all([
            productModel.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
            productModel.countDocuments(filter)
        ])

        res.json({
            success: true,
            products,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        })
    }
    catch (error) {
        console.error("listProducts error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── Remove product ───────────────────────────────────────────────────────────
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return res.status(400).json({ success: false, message: "Product ID is required" })

        const product = await productModel.findByIdAndDelete(id)
        if (!product) return res.status(404).json({ success: false, message: "Product not found" })

        res.json({ success: true, message: "Product removed" })
    }
    catch (error) {
        console.error("removeProduct error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── Single product ───────────────────────────────────────────────────────────
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        if (!productId) return res.status(400).json({ success: false, message: "Product ID is required" })

        const product = await productModel.findById(productId)
        if (!product) return res.status(404).json({ success: false, message: "Product not found" })

        res.json({ success: true, product })
    }
    catch (error) {
        console.error("singleProduct error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }