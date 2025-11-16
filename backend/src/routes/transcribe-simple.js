// backend/src/routes/transcribe-simple.js
import express from 'express'
import multer from 'multer'

const router = express.Router()

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
})

router.post('/', upload.single('video'), async (req, res) => {
  try {
    console.log('📹 Received video for demo captions')
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' })
    }

    const fileName = req.file.originalname
    const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2)
    
    console.log(`📊 File: ${fileName} (${fileSizeMB} MB)`)
    console.log('✅ Generating demo captions (Free tier mode)')

    // Simulate realistic processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Realistic demo captions with Hinglish
    const demoCaption = [
      { start: 0, end: 3, text: 'Welcome to our video platform', source: 'demo', language: 'english' },
      { start: 3, end: 6, text: 'यह एक demonstration है', source: 'demo', language: 'hinglish' },
      { start: 6, end: 9, text: 'This shows caption styles', source: 'demo', language: 'english' },
      { start: 9, end: 12, text: 'आप bottom, top या karaoke चुन सकते हैं', source: 'demo', language: 'hinglish' },
      { start: 12, end: 15, text: 'Export करने के लिए button click करें', source: 'demo', language: 'hinglish' },
      { start: 15, end: 18, text: 'Thank you for watching', source: 'demo', language: 'english' }
    ]

    console.log(`✅ Generated ${demoCaption.length} demo captions`)

    res.json({
      success: true,
      message: 'Captions generated successfully (Demo mode)',
      captions: demoCaption,
      metadata: {
        method: 'demo-captions',
        processingTime: '2.0s',
        captionCount: demoCaption.length,
        videoFile: fileName,
        note: 'Live demo uses pre-generated captions. For real AI processing, run locally.'
      }
    })

  } catch (error) {
    console.error('❌ Error:', error)
    res.status(500).json({ 
      error: 'Processing failed',
      details: error.message 
    })
  }
})

export default router