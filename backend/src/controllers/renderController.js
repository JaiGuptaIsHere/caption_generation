import { renderCaptionedVideo } from '../services/remotionService.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const renderVideo = async (req, res) => {
  try {
    const { videoPath, captions, style } = req.body

    if (!videoPath || !captions || !style) {
      return res.status(400).json({ 
        error: 'Missing required fields: videoPath, captions, style' 
      })
    }

    console.log('🎬 Starting video render...')

    // Generating output filename
    const outputFilename = `rendered-${Date.now()}.mp4`
    const outputPath = path.join(__dirname, '../../outputs', outputFilename)

    // Ensuring outputs directory exists
    await fs.ensureDir(path.join(__dirname, '../../outputs'))

    // Rendering video with Remotion
    await renderCaptionedVideo({
      videoPath,
      captions,
      style,
      outputPath
    })

    console.log('✅ Video rendered successfully')

    // Returning download URL
    res.json({
      message: 'Video rendered successfully',
      downloadUrl: `/outputs/${outputFilename}`,
      filename: outputFilename
    })

  } catch (error) {
    console.error('Render error:', error)
    res.status(500).json({ 
      error: 'Failed to render video',
      details: error.message 
    })
  }
}