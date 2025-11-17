// backend/src/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import uploadRoutes from './routes/upload.js'
import transcribeRoutes from './routes/transcribe.js'  // ✅ Real AI version

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://caption-generation-dusky.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/outputs', express.static(path.join(__dirname, '../outputs')))

// Routes
app.use('/api/upload', uploadRoutes)
app.use('/api/transcribe', transcribeRoutes)  // ✅ Real AI

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Caption Backend API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      transcribe: '/api/transcribe',
      upload: '/api/upload'
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Caption backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50))
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📁 Uploads: ${path.join(__dirname, '../uploads')}`)
  console.log(`🎬 Outputs: ${path.join(__dirname, '../outputs')}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`✅ Server is ready`)
  console.log('='.repeat(50))
})

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason)
})