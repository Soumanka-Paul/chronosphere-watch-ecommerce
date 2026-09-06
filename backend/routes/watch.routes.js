import express  from 'express'
import multer   from 'multer'
import {
  getAllWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch,
} from '../controllers/watch.controller.js'
import protect   from '../middleware/auth.middleware.js'
import adminOnly from '../middleware/admin.middleware.js'

// ── Multer setup ──
// memoryStorage → stores file in memory as buffer
// instead of saving to disk
// We then send this buffer to Cloudinary
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  // Only allow image files
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)  // accept file
    } else {
      cb(new Error('Only images allowed'), false) // reject
    }
  },
  // Max file size 5MB
  limits: { fileSize: 5 * 1024 * 1024 },
})

const router = express.Router()

// Public routes
router.get('/',    getAllWatches)
router.get('/:id', getWatchById)

// Admin routes with image upload
// upload.array('images', 5) → accept up to 5 images
// field name must be 'images' in form data
router.post('/',      protect, adminOnly, upload.array('images', 5), createWatch)
router.put('/:id',    protect, adminOnly, upload.array('images', 5), updateWatch)
router.delete('/:id', protect, adminOnly, deleteWatch)

export default router