import { useEffect, useRef, useState } from 'react'
import './RawVideoPreview.css'

export default function RawVideoPreview({ videoFile, onDurationLoad }) {
  const videoRef = useRef(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile)
      setVideoUrl(url)

      return () => URL.revokeObjectURL(url)
    }
  }, [videoFile])

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration
      setDuration(dur)
      
      if (onDurationLoad) {
        onDurationLoad(dur)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!videoFile) {
    return (
      <div className="raw-preview-placeholder">
        <svg 
          width="100" 
          height="100" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
          <line x1="7" y1="2" x2="7" y2="22"/>
          <line x1="17" y1="2" x2="17" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="2" y1="7" x2="7" y2="7"/>
          <line x1="2" y1="17" x2="7" y2="17"/>
          <line x1="17" y1="17" x2="22" y2="17"/>
          <line x1="17" y1="7" x2="22" y2="7"/>
        </svg>
        <p>No video uploaded</p>
        <p className="hint">Upload an MP4 file to preview</p>
      </div>
    )
  }

  return (
    <div className="raw-video-preview">
      <div className="preview-header">
        <h3>📹 Original Video</h3>
        <div className="video-info">
          <span className="file-name">{videoFile.name}</span>
          <span className="file-size">
            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </div>

      <div className="video-container">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          className="raw-video-player"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-stats">
        <div className="stat">
          <span className="label">Current Time:</span>
          <span className="value">{formatTime(currentTime)}</span>
        </div>
        <div className="stat">
          <span className="label">Duration:</span>
          <span className="value">{formatTime(duration)}</span>
        </div>
        <div className="stat">
          <span className="label">Resolution:</span>
          <span className="value">
            {videoRef.current?.videoWidth || 0} × {videoRef.current?.videoHeight || 0}
          </span>
        </div>
      </div>
    </div>
  )
}