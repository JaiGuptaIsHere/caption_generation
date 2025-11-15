# 🎬 Simora.AI Assignment: Jai Gupta

A full-stack web application that automatically generates captions for videos using AI and overlays them with customizable styles using Remotion. Built with React, Node.js, and Whisper AI.


## 🎯 Project Overview

This application allows users to:
1. Upload MP4 videos through an intuitive interface
2. Automatically generate time-synced captions using AI (supports Hinglish)
3. Preview captions overlaid on video in real-time
4. Choose from multiple caption styles (Bottom, Top, Karaoke)
5. Export captions as SRT files for use in video editing software

**Developed by:** Jai Gupta  
**Submitted to:** Simora (Full-Stack Developer Task)

---

## ✨ Features

### Core Features (Mandatory Requirements)

✅ **Remotion Integration**
- Real-time video preview with caption overlay using Remotion Player
- Frame-accurate caption synchronization
- Support for custom caption styling and positioning

✅ **Video Upload**
- Supports MP4 video files up to 100MB
- Instant video preview after upload
- File validation and error handling

✅ **Auto-Captioning with AI**
- **Hybrid Approach**: Automatic fallback system
  - **Primary**: OpenAI Whisper API (fast, high accuracy)
  - **Fallback**: Local Whisper model (@xenova/transformers) - completely free and offline
- Smart switching: Uses API when available, falls back to local processing if quota exhausted
- Average processing time: 3-5 seconds (API) or 15-30 seconds (local)

✅ **Hinglish Support** 🇮🇳
- Full support for mixed Hindi (Devanagari) and English text
- Uses Google Fonts: `Noto Sans` and `Noto Sans Devanagari`
- Proper UTF-8 encoding for accurate Hindi character rendering
- Tested with real Hinglish content

✅ **Caption Style Presets**
1. **Bottom (Standard)**: Classic subtitle style at bottom of video
2. **Top (News-Style)**: Full-width banner at top with red accent line
3. **Karaoke**: Center-aligned with word-by-word color highlighting as they're spoken

✅ **Preview & Export**
- Real-time preview using Remotion Player with all caption styles
- Export captions as SRT (SubRip) format
- SRT files compatible with all major video editors (Premiere Pro, DaVinci Resolve, Final Cut Pro)



### 🎁 Bonus Features Implemented

✅ **Offline Whisper Model** (BONUS)
- Local speech-to-text using @xenova/transformers
- Completely free, no API costs
- Works entirely offline
- Automatic model caching (~74MB first download)


✅ **Word-Level Karaoke Highlighting** (BONUS)
- Real-time word-by-word color highlighting
- Progressive color changes: White → Yellow (current) → Gold (completed)
- Smooth transitions based on caption timing

✅ **Production-Ready Architecture** (BONUS)
- Modular, scalable codebase
- Separation of concerns (routes, controllers, services)
- Comprehensive error handling
- RESTful API design

✅ **Responsive UI/UX** (BONUS)
- Clean, modern interface with gradient backgrounds
- Fully responsive design (mobile, tablet, desktop)
- Step-by-step guided workflow
- Real-time feedback and loading states
- Accessibility considerations

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2.0 with Vite
- **Video Rendering**: Remotion 4.0.215
- **Player**: @remotion/player
- **Styling**: Custom CSS3 with CSS Grid & Flexbox
- **Fonts**: Google Fonts (Noto Sans family)
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Speech-to-Text**: 
  - OpenAI Whisper API (whisper-1 model)
  - Local Whisper (@xenova/transformers)
- **File Upload**: Multer
- **Audio Processing**: FFmpeg (via fluent-ffmpeg)
- **Environment**: dotenv

### DevOps & Deployment
- **Frontend Hosting**: Vercel/Netlify
- **Backend Hosting**: Render/Railway
- **Version Control**: Git & GitHub
- **Package Manager**: npm

---

## 📁 Project Structure
```
jai_gupta_simora/
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── RawVideoPreview.jsx      # Original video display
│   │   │   ├── VideoPreview.jsx         # Captioned video preview
│   │   │   └── *.css
│   │   ├── remotion/            # Remotion compositions
│   │   │   └── CaptionComposition.jsx   # Caption overlay logic
│   │   ├── utils/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main application
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── backend/                      # Node.js API server
    ├── src/
    │   ├── routes/              # API endpoints
    │   │   ├── upload.js
    │   │   ├── transcribe.js
    │   │   └── render.js
    │   ├── controllers/         # Request handlers
    │   │   └── transcribeController.js
    │   ├── services/            # Business logic
    │   │   ├── whisperService.js       # OpenAI Whisper
    │   │   └── whisperLocalService.js  # Local Whisper
    │   └── server.js            # Express app
    ├── uploads/                 # Temporary storage
    ├── outputs/                 # Rendered videos
    ├── .env                     # Environment variables
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

To verify installations:
```bash
node --version    # Should show v18+
npm --version     # Should show v9+
```

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/jai_gupta_simora.git
cd jai_gupta_simora
```

---

### 2️⃣ Backend Setup
```bash
cd backend

npm install

cp .env.example .env
```

**Edit `.env` file:**
```env
PORT=5000
NODE_ENV=development

# Optional: Add OpenAI API key for faster transcription
# Leave blank to use free local Whisper
OPENAI_API_KEY=your_openai_api_key_here

FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=104857600
```

**Start backend server:**
```bash
npm run dev
```

Backend will run on: **http://localhost:5000**

You should see:
```
🚀 Server running on http://localhost:5000
📁 Uploads: /path/to/uploads
🎬 Outputs: /path/to/outputs
🌍 Environment: development
✅ OpenAI API Key: Configured (or using local Whisper)
```

---

### 3️⃣ Frontend Setup

Open a **new terminal** window:
```bash
cd frontend

npm install

npm run dev
```

Frontend will run on: **http://localhost:5173**

You should see:
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 4️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

The application should now be running! 🎉

---

## 📖 How to Use the Application

### Step-by-Step Guide

#### **Step 1: Upload Video**
1. Click the "📁 Choose MP4 File" button
2. Select a video file from your device (max 100MB)
3. Wait for the video to load

#### **Step 2: Preview Original Video**
1. The original video will appear with playback controls
2. You can preview the video to ensure it uploaded correctly
3. Video information (duration, size, resolution) will be displayed

#### **Step 3: Generate Captions**
1. Click "🎤 Auto-Generate Captions" button
2. The system will process your video audio:
   - **With API Key**: Takes 3-10 seconds
   - **Without API Key (Local)**: Takes 15-40 seconds (first time downloads 74MB model)
3. Watch the backend terminal for progress updates
4. Captions will appear automatically when ready

#### **Step 4: Choose Caption Style**
Select from three styles:
- **📍 Bottom (Standard)**: Traditional subtitles at bottom
- **📰 Top (News Style)**: News ticker at top
- **🎵 Karaoke**: Center-aligned with word highlighting

#### **Step 5: Preview with Captions**
1. Play the video using Remotion Player
2. Watch captions appear in real-time, synced with audio
3. Try different styles to see variations
4. Captions support both English and Hindi (Hinglish)

#### **Step 6: Export Captions**
1. Click "📥 Download Captions (.srt)"
2. SRT file will be downloaded to your device
3. Use the SRT file in any video editor:
   - **Adobe Premiere Pro**: File → Import → .srt file
   - **DaVinci Resolve**: Edit → Import → Subtitle
   - **Final Cut Pro**: File → Import → Captions

---

## 🎤 Caption Generation Details

### Hybrid Whisper Approach

The application uses an intelligent hybrid system:

#### **Method 1: OpenAI Whisper API** (Primary)
- **Model**: whisper-1
- **Cost**: $0.006 per minute of audio
- **Speed**: ⚡ Fast (3-10 seconds)
- **Accuracy**: ⭐⭐⭐ Excellent
- **Language**: Configured for Hindi ('hi') to support Hinglish
- **Requirements**: Valid OpenAI API key in `.env`

#### **Method 2: Local Whisper** (Automatic Fallback)
- **Library**: @xenova/transformers
- **Model**: Xenova/whisper-tiny
- **Cost**: 💰 Completely FREE
- **Speed**: 🐢 Slower (15-40 seconds)
- **Accuracy**: ⭐⭐ Good
- **Offline**: ✅ Works without internet (after initial model download)
- **First Run**: Downloads ~74MB model (cached for future use)

#### **How It Works:**
```javascript
if (OpenAI API key exists and valid) {
  try {
    Use OpenAI Whisper API  // Fast path
  } catch (quota_exceeded or error) {
    Fallback to Local Whisper  // Free path
  }
} else {
  Use Local Whisper directly  // No API key needed
}
```

**Benefits:**
- ✅ Always works (never fails due to API limits)
- ✅ Cost-effective (free option available)
- ✅ Smart resource usage
- ✅ Transparent to user

---

## 🌐 Hinglish Support Implementation

### What is Hinglish?

Hinglish is a hybrid language combining:
- **Hindi** (Devanagari script: हिंदी)
- **English** (Latin script: English)


#### **3. Whisper Configuration**
```javascript
// Backend configuration
language: 'hi'  // Hindi language mode (supports mixed Hindi+English)
```


## 🎨 Caption Styles Explained

### 1. Bottom (Standard)
```
Position: Bottom-centered, 60px from edge
Background: Semi-transparent black (85% opacity)
Font Size: 42px
Use Case: Traditional subtitles, most readable
```

### 2. Top (News-Style)
```
Position: Top of video, full width
Background: Dark black (90% opacity)
Accent: Red bottom border (news ticker style)
Font Size: 38px
Use Case: News broadcasts, announcements
```

### 3. Karaoke
```
Position: Center of video
Background: Gradient (purple-blue)
Font Size: 52px
Special: Word-by-word color highlighting
  - White: Not yet spoken
  - Yellow (glowing): Currently speaking
  - Gold: Already spoken
Use Case: Music videos, sing-along content
```

---


## 🧪 Testing the Application

### Local Testing
```bash
# Test backend health
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "ok",
  "message": "Caption backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "openaiConfigured": true
}
```

### Test Cases

| Test Case | Expected Result |
|-----------|-----------------|
| Upload valid MP4 | ✅ Video preview appears |
| Upload non-MP4 file | ❌ Error message shown |
| Upload oversized file (>100MB) | ❌ Error message shown |
| Generate captions | ✅ Captions appear in 3-40 seconds |
| Switch caption styles | ✅ Styles change in real-time |
| Export SRT | ✅ File downloads successfully |
| Open SRT in text editor | ✅ Hindi text displays correctly |
| Import SRT in video editor | ✅ Captions sync correctly |

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Initial Page Load** | < 2 seconds |
| **Video Upload** | < 5 seconds (for 50MB file) |
| **Caption Generation (API)** | 3-10 seconds |
| **Caption Generation (Local)** | 15-40 seconds |
| **Model Download (First Time)** | 60-120 seconds (74MB) |
| **Style Switch** | Instant |
| **SRT Export** | < 1 second |

---


## 📝 API Documentation

### Endpoints

#### **POST /api/transcribe**
Generate captions from video

**Request:**
```http
POST /api/transcribe
Content-Type: multipart/form-data

video: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Captions generated successfully",
  "captions": [
    {
      "start": 0,
      "end": 2.5,
      "text": "Hello world",
      "source": "openai-whisper",
      "language": "hinglish"
    }
  ],
  "metadata": {
    "method": "openai-api",
    "processingTime": "3.45s",
    "captionCount": 12,
    "videoFile": "video.mp4"
  }
}
```

---

#### **GET /api/health**
Health check

**Response:**
```json
{
  "status": "ok",
  "message": "Caption backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "openaiConfigured": true
}
```

---

## 🎓 Learning Outcomes

Through this project, I demonstrated proficiency in:

### Technical Skills
- ✅ Full-stack JavaScript development (React + Node.js)
- ✅ RESTful API design and implementation
- ✅ Video processing and manipulation
- ✅ AI/ML integration (Whisper models)
- ✅ Real-time data synchronization
- ✅ File handling and storage
- ✅ Unicode and internationalization (Hinglish)

### Software Engineering
- ✅ Modular architecture design
- ✅ Error handling and graceful degradation
- ✅ Performance optimization
- ✅ Responsive UI/UX design
- ✅ Documentation best practices
- ✅ Version control with Git

### DevOps
- ✅ Environment configuration
- ✅ Deployment strategies
- ✅ CI/CD concepts
- ✅ Cloud hosting (Vercel, Render)

---

## 🔮 Future Enhancements

Potential improvements for production:

1. **Video Rendering**
   - Implement server-side Remotion rendering
   - Generate final MP4 with burned-in captions

2. **Authentication**
   - User accounts and login system
   - Save caption history per user

3. **Advanced Features**
   - Multiple caption tracks
   - Caption editing interface
   - Custom font selection
   - Caption translation

4. **Performance**
   - Video compression before upload
   - Background processing with job queues
   - CDN integration for faster delivery

5. **Analytics**
   - Track usage statistics
   - Caption accuracy metrics
   - User engagement data

---

Hope the assignment is good...