import OpenAI from 'openai'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

let openai = null

if (process.env.OPENAI_API_KEY && 
    process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' &&
    process.env.OPENAI_API_KEY.startsWith('sk-')) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

export const generateCaptions = async (videoPath) => {
  if (!openai) {
    throw new Error('OpenAI API not configured')
  }

  try {
    console.log('🌐 Calling OpenAI Whisper API for Hinglish transcription...')
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(videoPath),
      model: 'whisper-1',
      response_format: 'verbose_json',
      
      language: 'hi',  
      
      timestamp_granularities: ['segment']
    })

    console.log('✅ Hinglish transcription complete')

    const captions = formatCaptions(transcription)
    return captions

  } catch (error) {
    console.error('❌ Whisper API error:', error.message)
    throw new Error(`OpenAI API failed: ${error.message}`)
  }
}

const formatCaptions = (transcription) => {
  if (!transcription.segments || transcription.segments.length === 0) {
    return [{
      start: 0,
      end: 5,
      text: transcription.text || 'No speech detected',
      source: 'openai-whisper'
    }]
  }

  return transcription.segments.map(segment => ({
    start: parseFloat(segment.start.toFixed(2)),
    end: parseFloat(segment.end.toFixed(2)),
    
    text: segment.text.trim(),
    
    source: 'openai-whisper',
    language: 'hinglish'
  }))
}

export const isOpenAIConfigured = () => {
  return openai !== null
}