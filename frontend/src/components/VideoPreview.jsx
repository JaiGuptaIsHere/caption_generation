import { Player } from '@remotion/player'
import CaptionComposition from '../remotion/CaptionComposition'
import './VideoPreview.css'

export default function VideoPreview({ 
  videoUrl,
  captions = [],
  captionStyle = 'bottom',
  videoDuration = 30,
  fps = 30,
  onExport,          
  isExporting = false
}) {
  const durationInFrames = Math.ceil(videoDuration * fps)

  if (!videoUrl) {
    return (
      <div className="preview-placeholder">
        <p>📹 Upload a video to see preview</p>
      </div>
    )
  }

  return (
    <div className="video-preview-container">
      <h2>🎬 Live Preview with Captions</h2>
      <p className="preview-info">
        ⏱️ Duration: {videoDuration.toFixed(2)}s | 🎨 Style: <strong>{captionStyle}</strong> | 📝 {captions.length} captions
      </p>

      <div className="preview-banner">
        ✨ <strong>Real-time Preview:</strong> Play the video to see captions overlaid in your selected style!
      </div>

      <div className="player-wrapper">
        <Player
          component={CaptionComposition}
          inputProps={{
            videoSrc: videoUrl,
            captions: captions,
            style: captionStyle
          }}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{
            width: '100%',
            maxWidth: '800px',
            aspectRatio: '16/9',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}
          controls
          loop
          clickToPlay
        />
      </div>

      <div className="player-instructions">
        <p>▶️ Click play to see captions appear on the video</p>
        <p>🔄 Change the caption style above to see different layouts</p>
      </div>

      <div className="caption-timeline">
        <h3>📝 Caption Timeline ({captions.length} segments)</h3>
        {captions.length === 0 ? (
          <div className="no-captions">
            <p>No captions generated yet</p>
            <p className="hint">Click "Auto-Generate Captions" to create them</p>
          </div>
        ) : (
          <div className="caption-list">
            {captions.map((caption, index) => (
              <div key={index} className="caption-item">
                <span className="caption-number">#{index + 1}</span>
                <span className="timestamp">
                  {caption.start.toFixed(2)}s - {caption.end.toFixed(2)}s
                </span>
                <span className="caption-text">{caption.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="export-section">
        <h3>📥 Ready to Export?</h3>
        <p className="export-description">
          Export your video with captions burned in. The final video will include all captions in the <strong>{captionStyle}</strong> style.
        </p>
        <button 
          className="export-btn"
          disabled={!captions.length}
          onClick={onExport}
        >
          {captions.length 
            ? '🎬 Export Video with Captions' 
            : '⚠️ Generate Captions First'}
        </button>
        {!captions.length && (
          <p className="warning">⚠️ You need to generate captions before exporting</p>
        )}
      </div>
    </div>
  )
}