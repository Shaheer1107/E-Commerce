import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// ✅ Removed duplicate cloudinary.config() block — this is already handled
//    in connectCloudinary() which is called once at server startup in server.js

// Add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        if (!name || !description || !price || !category || !subCategory || !sizes) {
            return res.status(400).json({ success: false, message: "All product fields are required" });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required" });
        }

        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true : false,
            images: imagesUrl,
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: "Product Added" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List all products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove a product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        await productModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Product removed" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, product });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }