# 🎵 Smart Music Theory Tutor

AI-powered music theory learning platform with AMEB-style questions, musical notation, and audio examples.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key

### Installation
```bash
# Clone and install
git clone <repository-url>
cd smart-music-theory-tutor
npm run install-all

# Setup environment
cp .env.example .env
# Add your OpenAI API key to .env

# Start the app
npm run dev
```

**Access:** http://localhost:3000

## ✨ Features

- **4 Instruments**: Piano, Violin, Guitar, Flute
- **8 Grade Levels**: Beginner to Licentiate (AMEB syllabus)
- **AI Questions**: GPT-4 generated with fallback system
- **Audio & Notation**: Interactive musical examples
- **Progress Tracking**: Performance analytics and achievements

## 🛠️ Tech Stack

**Frontend:** React + TypeScript + Tailwind CSS  
**Backend:** Node.js + Express + SQLite  
**AI:** OpenAI GPT-4  
**Audio:** Web Audio API + Tone.js  
**Notation:** VexFlow + SVG rendering

## 📁 Project Structure

```
├── client/          # React frontend
├── server/          # Node.js backend
├── database/        # SQLite database
└── .env            # Environment config
```

## 🎯 Usage

1. **Select Instrument & Grade** → Choose your focus area
2. **Generate Question** → AI creates theory question
3. **Answer & Learn** → Get instant feedback with explanations
4. **Track Progress** → Monitor improvement over time

## 🔧 Development

```bash
npm run dev          # Start both frontend & backend
npm run server       # Backend only (port 5001)
npm run client       # Frontend only (port 3000)
npm run build        # Production build
```

## 🐳 Docker

```bash
docker-compose up --build
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `PORT` | Backend port | No (default: 5001) |

## 🎵 AMEB Syllabus Coverage

- **Grades 1-2**: Basic notes, time signatures, major scales
- **Grades 3-4**: Minor scales, triads, key signatures  
- **Grades 5-6**: Advanced intervals, chord progressions
- **Grades 7-8**: Advanced harmony, composition techniques

## 📊 API Endpoints

```http
POST /api/questions/generate
GET  /api/health
POST /api/questions/:id/answer
GET  /api/progress
```

## 🐛 Troubleshooting

**Audio Issues:** Check browser Web Audio API support  
**API Errors:** Verify OpenAI API key in `.env`  
**Port Conflicts:** Kill processes on ports 3000/5001

## 📄 License

MIT License

---

**Built for music education** 🎼