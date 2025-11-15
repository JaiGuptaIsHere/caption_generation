import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import uploadRoutes from './routes/upload.js'
import transcribeRoutes from './routes/transcribe.js'
import renderRoutes from './routes/render.js'
import statusRoutes from './routes/status.js'


dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use('/api/status', statusRoutes)


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/outputs', express.static(path.join(__dirname, '../outputs')))

app.use('/api/upload', uploadRoutes)
app.use('/api/transcribe', transcribeRoutes)
app.use('/api/render', renderRoutes)

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Caption backend is running',
    timestamp: new Date().toISOString()
  })
})

app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📁 Uploads directory: ${path.join(__dirname, '../uploads')}`)
  console.log(`🎬 Outputs directory: ${path.join(__dirname, '../outputs')}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})