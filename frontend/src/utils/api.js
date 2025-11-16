const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://caption-generation-h0he.onrender.com/api'

export const transcribeVideo = async (videoFile) => {
  const formData = new FormData()
  formData.append('video', videoFile)

  const response = await fetch(`${API_BASE_URL}/transcribe`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to transcribe video')
  }

  return response.json()
}

export const renderVideo = async (videoPath, captions, style) => {
  const response = await fetch(`${API_BASE_URL}/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      videoPath,
      captions,
      style
    })
  })

  if (!response.ok) {
    throw new Error('Failed to render video')
  }

  return response.json()
}