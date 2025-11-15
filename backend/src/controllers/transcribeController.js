import { generateCaptionsLocal } from '../services/whisperLocalService.js'
import { generateCaptions, isOpenAIConfigured } from '../services/whisperService.js'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const transcribeVideo = async (req, res) => {
  let tempFilePath = null
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' })
    }

    console.log('📹 Transcribing video:', req.file.originalname)
    console.log('📊 File size:', (req.file.size / (1024 * 1024)).toFixed(2), 'MB')

    const tempDir = path.join(__dirname, '../../uploads/temp')
    await fs.ensureDir(tempDir)
    
    tempFilePath = path.join(tempDir, `temp-${Date.now()}.mp4`)
    await fs.writeFile(tempFilePath, req.file.buffer)

    let captions
    let method = 'local'
    let processingTime = 0

    
    if (isOpenAIConfigured()) {
      try {
        console.log('🔄 Attempting OpenAI Whisper API...')
        const startTime = Date.now()
        
        captions = await generateCaptions(tempFilePath)
        
        processingTime = ((Date.now() - startTime) / 1000).toFixed(2)
        method = 'openai-api'
        
        console.log(`✅ Used OpenAI API (${processingTime}s)`)
        
      } catch (apiError) {
        console.error('⚠️ OpenAI API failed:', apiError.message)
        
        if (apiError.message.includes('QUOTA_EXCEEDED') || 
            apiError.message.includes('INVALID_KEY') ||
            apiError.message.includes('RATE_LIMITED')) {
          
          console.log('🔄 Falling back to local Whisper...')
          
          const startTime = Date.now()
          captions = await generateCaptionsLocal(tempFilePath)
          processingTime = ((Date.now() - startTime) / 1000).toFixed(2)
          method = 'local-whisper-fallback'
          
          console.log(`✅ Used local Whisper as fallback (${processingTime}s)`)
        } else {
          throw apiError  
        }
      }
    } else {
      console.log('🏠 Using local Whisper (no API key configured)...')
      
      const startTime = Date.now()
      captions = await generateCaptionsLocal(tempFilePath)
      processingTime = ((Date.now() - startTime) / 1000).toFixed(2)
      method = 'local-whisper'
      
      console.log(`✅ Used local Whisper (${processingTime}s)`)
    }

    await fs.remove(tempFilePath)

    res.json({
      success: true,
      message: 'Captions generated successfully',
      captions: captions,
      metadata: {
        method: method,
        processingTime: `${processingTime}s`,
        captionCount: captions.length,
        videoFile: req.file.originalname
      }
    })

  } catch (error) {
    console.error('❌ Transcription error:', error)
    
    if (tempFilePath) {
      await fs.remove(tempFilePath).catch(console.error)
    }

    res.status(500).json({ 
      success: false,
      error: 'Failed to generate captions',
      details: error.message,
      suggestion: 'Try with a shorter video or check backend logs'
    })
  }
}