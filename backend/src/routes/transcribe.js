import express from 'express'
import multer from 'multer'
import { transcribeVideo } from '../controllers/transcribeController.js'

const router = express.Router()

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
})

router.post('/', upload.single('video'), transcribeVideo)

export default router