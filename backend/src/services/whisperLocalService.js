import { pipeline } from '@xenova/transformers'
import path from 'path'
import fs from 'fs-extra'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

let transcriber = null


async function initTranscriber() {
  if (!transcriber) {
    console.log('🔄 Loading local Whisper model (first time takes ~1-2 min)...')
    console.log('📥 Downloading model files (~74MB for tiny model)...')
    
    transcriber = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny', 
      { 
        quantized: false,
        cache_dir: path.join(process.cwd(), '.cache')
      }
    )
    
    console.log('✅ Local Whisper model loaded successfully!')
  }
  return transcriber
}


async function extractAudio(videoPath) {
  return new Promise((resolve, reject) => {
    const outputPath = videoPath.replace('.mp4', '_audio.wav')
    
    console.log('🎵 Extracting audio from video...')
    console.log('   Input:', videoPath)
    console.log('   Output:', outputPath)
    
    ffmpeg(videoPath)
      .toFormat('wav')
      .audioFrequency(16000) 
      .audioChannels(1)       
      .on('start', (cmd) => {
        console.log('   FFmpeg command:', cmd)
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`   Progress: ${Math.round(progress.percent)}%`)
        }
      })
      .on('end', () => {
        console.log('✅ Audio extraction complete')
        resolve(outputPath)
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg error:', err.message)
        reject(new Error(`Audio extraction failed: ${err.message}`))
      })
      .save(outputPath)
  })
}


async function readAudioFile(audioPath) {
  try {
    console.log('📖 Reading audio file...')
    
    const wavBuffer = await fs.readFile(audioPath)
    
    const audioData = new Int16Array(
      wavBuffer.buffer, 
      wavBuffer.byteOffset + 44
    )
    
    const float32Audio = new Float32Array(audioData.length)
    for (let i = 0; i < audioData.length; i++) {
      float32Audio[i] = audioData[i] / 32768.0
    }
    
    console.log(`✅ Audio loaded: ${float32Audio.length} samples (${(float32Audio.length / 16000).toFixed(2)}s)`)
    
    return float32Audio
    
  } catch (error) {
    console.error('❌ Error reading audio:', error)
    throw new Error(`Failed to read audio file: ${error.message}`)
  }
}


export const generateCaptionsLocal = async (videoPath) => {
  let audioPath = null
  
  try {
    console.log('🎤 Starting local Whisper transcription (Hinglish mode)...')
    console.log('📁 Video file:', videoPath)
    
    const startTime = Date.now()
    
    audioPath = await extractAudio(videoPath)
    
    const audioData = await readAudioFile(audioPath)
    
    const model = await initTranscriber()
    
    console.log('🔊 Transcribing audio (detecting Hindi + English)...')
    const result = await model(audioData, {
      chunk_length_s: 30,       
      stride_length_s: 5,       
      return_timestamps: 'word',  
      
      language: 'hi',          
      
      task: 'transcribe',       
      
  
      best_of: 5,              
      temperature: 0.0         
    })

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`✅ Hinglish transcription complete in ${duration}s`)
    
    if (audioPath) {
      await fs.remove(audioPath).catch(err => {
        console.error('⚠️ Failed to clean up audio file:', err.message)
      })
    }
    
    const captions = formatLocalCaptions(result)
    
    console.log(`📝 Generated ${captions.length} caption segments`)
    console.log(`🌐 Language: Hinglish (Hindi + English)`)
    
    return captions

  } catch (error) {
    if (audioPath) {
      await fs.remove(audioPath).catch(console.error)
    }
    
    console.error('❌ Local Whisper error:', error)
    throw new Error(`Local Whisper failed: ${error.message}`)
  }
}


const formatLocalCaptions = (result) => {
  console.log('🔄 Formatting captions for Hinglish support...')
  
  if (!result.chunks || result.chunks.length === 0) {
    console.log('⚠️ No timestamp chunks found, using full text')
    return [{
      start: 0,
      end: 5,
      text: result.text?.trim() || 'No speech detected',
      source: 'local-whisper',
      language: 'hinglish'
    }]
  }

  const captions = result.chunks
    .filter(chunk => chunk.text && chunk.text.trim().length > 0)
    .map(chunk => {
      const start = chunk.timestamp[0] || 0
      const end = chunk.timestamp[1] || start + 5
      
      return {
        start: parseFloat(start.toFixed(2)),
        end: parseFloat(end.toFixed(2)),
        
        text: chunk.text.trim(),
        
        source: 'local-whisper',
        language: 'hinglish'
      }
    })

  const mergedCaptions = mergeCaptions(captions)
  
  if (mergedCaptions.length > 0) {
    console.log('📄 Sample caption:', mergedCaptions[0].text.substring(0, 50) + '...')
  }
  
  return mergedCaptions
}


const mergeCaptions = (captions) => {
  if (captions.length === 0) return captions
  
  console.log(`🔗 Merging ${captions.length} captions...`)
  
  const merged = []
  let current = { ...captions[0] }
  
  for (let i = 1; i < captions.length; i++) {
    const next = captions[i]
    const duration = current.end - current.start
    const gap = next.start - current.end
    
    if (
      duration < 1.5 && 
      gap < 0.5 && 
      (current.text.length + next.text.length) < 150
    ) {
      current.text += ' ' + next.text
      current.end = next.end
    } else {
      merged.push(current)
      current = { ...next }
    }
  }
  
  merged.push(current)
  
  console.log(`✅ Merged into ${merged.length} captions`)
  
  return merged
}

export const containsHindi = (text) => {
  const devanagariRegex = /[\u0900-\u097F]/
  return devanagariRegex.test(text)
}
export const getCaptionStats = (captions) => {
  let hindiCount = 0
  let englishOnly = 0
  let mixed = 0
  
  captions.forEach(caption => {
    const hasHindi = containsHindi(caption.text)
    const hasEnglish = /[a-zA-Z]/.test(caption.text)
    
    if (hasHindi && hasEnglish) {
      mixed++
    } else if (hasHindi) {
      hindiCount++
    } else if (hasEnglish) {
      englishOnly++
    }
  })
  
  return {
    total: captions.length,
    hindiOnly: hindiCount,
    englishOnly: englishOnly,
    hinglish: mixed,
    percentage: {
      hindiOnly: ((hindiCount / captions.length) * 100).toFixed(1) + '%',
      englishOnly: ((englishOnly / captions.length) * 100).toFixed(1) + '%',
      hinglish: ((mixed / captions.length) * 100).toFixed(1) + '%'
    }
  }
}


export const getModelInfo = () => {
  return {
    name: 'Xenova/whisper-tiny',
    size: '~74MB',
    language: 'Multilingual (Hinglish supported)',
    supportedScripts: ['Latin (English)', 'Devanagari (Hindi)'],
    offline: true,
    cost: 'Free',
    hinglishSupport: true
  }
}

export const validateCaptionEncoding = (captions) => {
  const issues = []
  
  captions.forEach((caption, index) => {
    if (caption.text.includes('�')) {
      issues.push(`Caption #${index + 1}: Contains replacement character (�) - encoding issue`)
    }
    
    if (!caption.text || caption.text.trim().length === 0) {
      issues.push(`Caption #${index + 1}: Empty text`)
    }
    
    if (caption.start >= caption.end) {
      issues.push(`Caption #${index + 1}: Invalid timestamps (start >= end)`)
    }
  })
  
  return {
    valid: issues.length === 0,
    issues: issues
  }
}