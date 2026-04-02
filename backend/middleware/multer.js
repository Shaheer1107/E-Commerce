import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// ✅ Generate a safe, unique filename
//    Original code used file.originalname — a user could upload a file called
//    "../../server.js" or "<script>.jpg" and potentially overwrite files or
//    cause issues. Using uuid + timestamp + just the extension is safe.
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase()
        const safeName = `${uuidv4()}-${Date.now()}${ext}`
        callback(null, safeName)
    }
})

// ✅ Only allow image file types
//    Without this, anyone can upload a .exe, .js, .php etc.
//    We check BOTH the mimetype AND the extension — checking only mimetype
//    is not enough because it can be spoofed by changing the Content-Type header
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

const fileFilter = (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
        callback(null, true)   // ✅ Accept
    } else {
        // ✅ Reject with an actual error message
        callback(new Error('Only image files (jpg, png, webp, gif) are allowed'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,   // ✅ 5MB max per file
                                      //    Without this, someone can upload a 500MB file
                                      //    and crash your server or eat your Cloudinary quota
        files: 4                      // ✅ Max 4 files per request (matches your image1–image4)
    }
})

export default upload