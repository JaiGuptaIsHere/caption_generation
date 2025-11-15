import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig } from 'remotion'

export default function CaptionComposition({ videoSrc, captions, style }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const currentTime = frame / fps
  
  const activeCaption = captions?.find(
    caption => currentTime >= caption.start && currentTime <= caption.end
  )

  const getKaraokeText = () => {
    if (!activeCaption || style !== 'karaoke') {
      return activeCaption?.text || ''
    }

    const captionDuration = activeCaption.end - activeCaption.start
    const timeIntoCaption = currentTime - activeCaption.start
    const progress = timeIntoCaption / captionDuration

    const words = activeCaption.text.split(' ')
    const currentWordIndex = Math.floor(progress * words.length)

    return words.map((word, index) => {
      if (index < currentWordIndex) {
        return `<span style="color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);">${word}</span>`
      } else if (index === currentWordIndex) {
        return `<span style="color: #ffff00; text-shadow: 0 0 20px rgba(255, 255, 0, 1); transform: scale(1.1); display: inline-block;">${word}</span>`
      } else {
        return `<span style="color: white;">${word}</span>`
      }
    }).join(' ')
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {videoSrc && (
        <Video 
          src={videoSrc} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      )}
      
      {activeCaption && activeCaption.text && (
        <>
       
          {style === 'bottom' && (
            <AbsoluteFill
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                padding: '0 40px 60px 40px',  
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.85)',
                  color: 'white',
                  padding: '16px 40px',
                  borderRadius: '8px',
                  fontSize: '42px',
                  fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
                  textAlign: 'center',
                  maxWidth: '85%',
                  lineHeight: 1.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                  fontWeight: '500'
                }}
              >
                {activeCaption.text}
              </div>
            </AbsoluteFill>
          )}

      
          {style === 'top' && (
            <AbsoluteFill
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start', 
                padding: '40px 0 0 0',    
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.9)',
                  color: 'white',
                  padding: '20px 40px',
                  width: '100%',            
                  maxWidth: '100%',
                  fontSize: '38px',
                  fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                  fontWeight: '600',
                  borderBottom: '3px solid #ff0000'
                }}
              >
                {activeCaption.text}
              </div>
            </AbsoluteFill>
          )}

          {/* KARAOKE STYLE */}
          {style === 'karaoke' && (
            <AbsoluteFill
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',     
                padding: '40px',
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(100, 108, 255, 0.95), rgba(83, 91, 242, 0.95))',
                  color: 'white',
                  padding: '24px 48px',
                  borderRadius: '16px',
                  fontSize: '52px',
                  fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
                  textAlign: 'center',
                  maxWidth: '90%',
                  lineHeight: 1.5,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                  fontWeight: '700',
                  border: '4px solid rgba(255,255,255,0.3)',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
                }}
                dangerouslySetInnerHTML={{ __html: getKaraokeText() }}
              />
            </AbsoluteFill>
          )}
        </>
      )}
    </AbsoluteFill>
  )
}