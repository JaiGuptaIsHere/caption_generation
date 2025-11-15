import express from 'express'
import { isOpenAIConfigured } from '../services/whisperService.js'
import { getModelInfo } from '../services/whisperLocalService.js'

const router = express.Router()

router.get('/', (req, res) => {
  const openaiConfigured = isOpenAIConfigured()
  const localModelInfo = getModelInfo()

  res.json({
    status: 'operational',
    captionMethods: {
      openai: {
        available: openaiConfigured,
        priority: 1,
        description: 'OpenAI Whisper API (paid, high accuracy, fast)'
      },
      local: {
        available: true,
        priority: 2,
        description: 'Local Whisper (free, good accuracy, slower)',
        model: localModelInfo
      }
    },
    strategy: openaiConfigured 
      ? 'Try OpenAI first, fallback to local if quota exceeded'
      : 'Use local Whisper only (no API key configured)'
  })
})

export default router