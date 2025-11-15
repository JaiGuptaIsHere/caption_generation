import { useState } from 'react'

export default function VideoUpload() {
  const [video, setVideo] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleUpload = (e) => {
    const file = e.target.files[0]
    setVideo(file)
    
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept="video/mp4" onChange={handleUpload} />
      
      {preview && (
        <video 
          src={preview} 
          controls 
          style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}
        />
      )}
    </div>
  )
}