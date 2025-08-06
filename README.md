# 🎵 Smart Music Theory Tutor

An AI-powered music theory learning platform that generates AMEB-style questions with musical notation, audio clips, and detailed explanations.

## 🌟 Features

- **Multi-instrument support**: Piano, Violin, Guitar, Flute
- **Grade-adaptive questions**: Grades 1-8 with progressive difficulty
- **AI-generated content**: Questions, notation, and explanations
- **Interactive audio**: Playable musical examples
- **Visual notation**: Rendered musical scores
- **Progress tracking**: Save results and track improvement
- **Responsive design**: Works on desktop and mobile

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-4 for question generation
- **Music**: Music21 for notation, Tone.js for audio
- **Database**: SQLite for data persistence
- **Notation**: VexFlow for score rendering

### Project Structure
```
smart-music-theory-tutor/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── database/              # SQLite database
├── assets/                # Static assets
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd smart-music-theory-tutor
npm run install-all
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Add your OpenAI API key to .env
```

3. **Start the development servers:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## 🎯 How It Works

### Question Generation Flow
1. User selects instrument and grade level
2. AI generates theory question based on AMEB syllabus
3. System creates corresponding musical notation
4. Audio clip is generated for the musical example
5. Detailed explanation is provided for learning

### AI Integration
- **Question Generation**: GPT-4 creates contextually relevant questions
- **Notation Creation**: Music21 generates accurate musical scores
- **Audio Synthesis**: Tone.js creates playable audio clips
- **Explanation**: AI provides detailed learning explanations

## 📚 AMEB Syllabus Coverage

### Grade 1-2 (Beginner)
- Basic note recognition
- Simple time signatures
- Basic intervals
- Major scales (C, G, F)

### Grade 3-4 (Intermediate)
- Minor scales
- Triads and chords
- Compound time signatures
- Key signatures

### Grade 5-6 (Advanced)
- Advanced intervals
- Chord progressions
- Modulation concepts
- Complex rhythms

### Grade 7-8 (Expert)
- Advanced harmony
- Composition techniques
- Music analysis
- Historical context

## 🎨 Creative Features

### Adaptive Learning
- Difficulty adjustment based on performance
- Personalized question selection
- Progress tracking with analytics

### Interactive Elements
- Real-time audio playback
- Visual notation highlighting
- Interactive score navigation

### Gamification
- Achievement badges
- Progress streaks
- Performance leaderboards

## 🔧 API Endpoints

### Generate Question
```http
POST /api/questions/generate
Content-Type: application/json

{
  "instrument": "piano",
  "grade": 3
}
```

### Response Format
```json
{
  "question": "What is the correct time signature for this musical phrase?",
  "options": {
    "A": "3/4",
    "B": "4/4", 
    "C": "6/8",
    "D": "2/4"
  },
  "correct": "B",
  "notation_image_base64": "data:image/png;base64,...",
  "audio_url": "/audio/generated-clip.mp3",
  "explanation": "This phrase contains 4 beats per measure..."
}
```

## 🎵 Musical Accuracy

All generated content follows:
- **AMEB syllabus standards**
- **Proper musical notation**
- **Accurate audio representation**
- **Pedagogically sound explanations**

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t music-tutor .
docker run -p 3000:3000 music-tutor
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- AMEB for syllabus guidelines
- OpenAI for AI capabilities
- Music21 for notation processing
- VexFlow for score rendering

---

**Built with ❤️ for music education** 