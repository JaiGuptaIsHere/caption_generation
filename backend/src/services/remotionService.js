import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const renderCaptionedVideo = async ({ videoPath, captions, style, outputPath }) => {
  try {
    console.log('📦 Bundling Remotion project...')

    const compositionDir = path.join(__dirname, '../../../frontend/src/remotion')
    
    const bundleLocation = await bundle({
      entryPoint: path.join(compositionDir, 'index.js'),
      webpackOverride: (config) => config,
    })

    console.log('🎯 Selecting composition...')

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'CaptionedVideo',
      inputProps: {
        videoSrc: videoPath,
        captions: captions,
        style: style
      }
    })

    console.log('🎬 Rendering video...')

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        videoSrc: videoPath,
        captions: captions,
        style: style
      }
    })

    console.log('✅ Render complete:', outputPath)

    return outputPath

  } catch (error) {
    console.error('Remotion render error:', error)
    throw error
  }
}