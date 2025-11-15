import { useState, useEffect } from 'react'
import RawVideoPreview from './components/RawVideoPreview'
import VideoPreview from './components/VideoPreview'
import './App.css'
import { transcribeVideo } from './utils/api'

function App() {
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [captions, setCaptions] = useState([])
  const [captionStyle, setCaptionStyle] = useState('bottom')
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false)
  const [isExporting, setIsExporting] = useState(false)  // ✅ Add this
  const [error, setError] = useState(null)

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  const formatSRTTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const milliseconds = Math.floor((seconds % 1) * 1000)
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`
  }

  const convertToSRT = (captions) => {
    return captions.map((caption, index) => {
      const startTime = formatSRTTime(caption.start)
      const endTime = formatSRTTime(caption.end)
      
    
      
      return `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n`
    }).join('\n')
  }

  const handleExport = async () => {
    if (!captions || captions.length === 0) {
      alert('⚠️ No captions to export!\n\nPlease generate captions first by clicking "Auto-Generate Captions".')
      return
    }

    const confirmed = window.confirm(
      '📥 Export Captions as SRT File\n\n' +
      `Video: ${videoFile?.name || 'Unknown'}\n` +
      `Captions: ${captions.length} segments\n` +
      `Duration: ${videoDuration.toFixed(2)} seconds\n` +
      `Style: ${captionStyle}\n\n` +
      'The SRT file can be used in any video editor to add captions.\n\n' +
      'Continue?'
    )

    if (!confirmed) return

    setIsExporting(true)
    setError(null)

    try {
      console.log('📥 Starting SRT export...')
      console.log(`   Captions: ${captions.length}`)
      console.log(`   Video: ${videoFile?.name}`)

      const srtContent = convertToSRT(captions)
      
      console.log('✅ SRT content generated')
      console.log('Preview:', srtContent.substring(0, 200) + '...')

      const blob = new Blob([srtContent], { 
        type: 'text/plain;charset=utf-8' 
      })

      const url = URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const baseFilename = videoFile?.name.replace('.mp4', '') || 'video'
      downloadLink.download = `${baseFilename}-captions-${timestamp}.srt`

      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      URL.revokeObjectURL(url)

      console.log('✅ SRT file downloaded successfully')

      alert(
        '✅ Captions Exported Successfully!\n\n' +
        `File: ${downloadLink.download}\n` +
        `Format: SubRip (.srt)\n` +
        `Captions: ${captions.length}\n\n` +
        'How to use:\n' +
        '1. Open your video editor (Premiere, DaVinci Resolve, etc.)\n' +
        '2. Import your original video\n' +
        '3. Import the .srt file\n' +
        '4. The editor will automatically sync captions!'
      )

    } catch (error) {
      console.error('❌ Export error:', error)
      setError('Failed to export captions. Please try again.')
      alert(
        '❌ Export Failed\n\n' +
        'Error: ' + error.message + '\n\n' +
        'Please try again or contact support.'
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    
    if (!file) return
    
    if (file.type !== 'video/mp4') {
      setError('Please upload an MP4 file')
      alert('Please upload an MP4 file')
      return
    }
    
    setError(null)  
    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    
    setCaptions([])
  }

  const handleDurationLoad = (duration) => {
    setVideoDuration(duration)
  }

 const generateCaptions = async () => {
  setIsGeneratingCaptions(true)
  setError(null)
  
  try {
    console.log('📤 Sending video for transcription...')
    
    const result = await transcribeVideo(videoFile)
    
    console.log('✅ Captions received:', result)
    console.log('🔧 Method used:', result.metadata?.method)
    console.log('⏱️ Processing time:', result.metadata?.processingTime)
    
    setCaptions(result.captions)
    
    if (result.metadata?.method) {
      const methodName = result.metadata.method.includes('openai') 
        ? 'OpenAI Whisper API' 
        : 'Local Whisper (Free)'
      
      alert(`✅ Captions generated successfully!\n\nMethod: ${methodName}\nTime: ${result.metadata.processingTime}\nCaptions: ${result.captions.length}`)
    }
    
  } catch (err) {
    console.error('Error generating captions:', err)
    setError('Failed to generate captions. Please try again.')
    alert('Failed to generate captions. Check console for details.')
  } finally {
    setIsGeneratingCaptions(false)
  }
}

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎬 Video Captioning Platform</h1>
        <p>Upload your video, generate captions, and export with style</p>
      </header>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <section className="upload-section">
        <h2>Step 1: Upload Video</h2>
        <div className="upload-input">
          <input 
            type="file" 
            accept="video/mp4"
            onChange={handleVideoUpload}
            id="video-upload"
          />
          <label htmlFor="video-upload" className="upload-label">
            {videoFile ? '✓ Change Video' : '📁 Choose MP4 File'}
          </label>
        </div>
        {videoFile && (
          <p className="file-info">
            Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
      </section>

      {videoFile && (
        <section className="preview-section">
          <h2>Step 2: Preview Original Video</h2>
          <RawVideoPreview 
            videoFile={videoFile}
            onDurationLoad={handleDurationLoad}
          />
        </section>
      )}

      {videoFile && (
        <section className="caption-section">
          <h2>Step 3: Generate Captions</h2>
          <button 
            onClick={generateCaptions}
            disabled={isGeneratingCaptions}
            className="generate-btn"
          >
            {isGeneratingCaptions ? '⏳ Generating...' : '🎤 Auto-Generate Captions'}
          </button>
        </section>
      )}

      {captions.length > 0 && (
        <section className="style-section">
          <h2>Step 4: Choose Caption Style</h2>
          <div className="style-selector">
            <label>
              <input 
                type="radio"
                name="style"
                value="bottom"
                checked={captionStyle === 'bottom'}
                onChange={(e) => setCaptionStyle(e.target.value)}
              />
              <span>📍 Bottom (Standard)</span>
            </label>
            <label>
              <input 
                type="radio"
                name="style"
                value="top"
                checked={captionStyle === 'top'}
                onChange={(e) => setCaptionStyle(e.target.value)}
              />
              <span>📰 Top (News Style)</span>
            </label>
            <label>
              <input 
                type="radio"
                name="style"
                value="karaoke"
                checked={captionStyle === 'karaoke'}
                onChange={(e) => setCaptionStyle(e.target.value)}
              />
              <span>🎵 Karaoke</span>
            </label>
          </div>
        </section>
      )}

      {captions.length > 0 && (
        <section className="preview-section">
          <h2>Step 5: Preview with Captions</h2>
          <VideoPreview 
            videoUrl={videoUrl}
            captions={captions}
            captionStyle={captionStyle}
            videoDuration={videoDuration}
          />
        </section>
      )}
    </div>
  )
}

export default App