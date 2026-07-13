import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authMiddleware } from '../middlewares/authMiddleware.js'

export const uploadRouter = Router()

// Ensure upload directory exists
const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, 'file-' + uniqueSuffix + ext)
  },
})

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/
  const mimeType = allowedTypes.test(file.mimetype)
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase())

  if (mimeType && extName) {
    return cb(null, true)
  }
  cb(new Error('Only images (jpg, jpeg, png, webp, gif) are allowed'))
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
})

// POST /api/upload - Upload an image (requires authentication)
// Anyone logged in as staff can upload images for products or reviews
uploadRouter.post('/', authMiddleware, upload.single('image'), (req: any, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Please upload an image file' })
    return
  }

  // Generate URL to access this image
  // Note: we can use a relative URL like `/uploads/filename` which resolves correctly under Vite proxy or domain root
  const imageUrl = `/uploads/${req.file.filename}`

  res.status(201).json({
    url: imageUrl,
    filename: req.file.filename,
    size: req.file.size,
  })
})
