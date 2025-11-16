// backend/src/server-deploy.js - CLEAN VERSION FOR DEPLOYMENT
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://caption-generation-dusky.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))

app.use(express.json())

// Simple upload handler
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
})

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Caption Backend API (Demo Mode)',
    status: 'running',
    mode: 'demo',
    note: 'Uses test captions. Run locally for full AI.'
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    mode: 'demo'
  })
})

// Transcribe endpoint with demo captions
app.post('/api/transcribe', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file' })
    }

    console.log(`📹 Video: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`)
    console.log('✅ Generating demo captions')

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const captions = [
      { start: 0, end: 3, text: 'Welcome to our video platform', source: 'demo' },
      { start: 3, end: 6, text: 'यह एक demonstration है', source: 'demo' },
      { start: 6, end: 9, text: 'This shows caption styles', source: 'demo' },
      { start: 9, end: 12, text: 'आप bottom, top या karaoke चुन सकते हैं', source: 'demo' },
      { start: 12, end: 15, text: 'Export करने के लिए button click करें', source: 'demo' },
      { start: 15, end: 18, text: 'Thank you for watching', source: 'demo' }
    ]

    console.log(`✅ Sent ${captions.length} captions`)

    res.json({
      success: true,
      message: 'Demo captions generated',
      captions,
      metadata: {
        method: 'demo',
        processingTime: '2.0s',
        captionCount: captions.length,
        videoFile: req.file.originalname
      }
    })

  } catch (error) {
    console.error('❌ Error:', error)
    res.status(500).json({ error: 'Failed', details: error.message })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50))
  console.log(`🚀 Demo Server running on port ${PORT}`)
  console.log(`⚡ Mode: Demo captions only`)
  console.log(`✅ Ready`)
  console.log('='.repeat(50))
})