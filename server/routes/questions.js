const express = require('express');
const router = express.Router();
const { generateQuestion } = require('../services/aiService');
const { createNotation } = require('../services/notationService');
const { generateAudio } = require('../services/audioService');
const { saveQuestion } = require('../services/databaseService');

// AMEB syllabus topics by grade
const AMEB_TOPICS = {
  1: ['note recognition', 'basic time signatures', 'simple intervals', 'major scales'],
  2: ['key signatures', 'minor scales', 'triads', 'compound time'],
  3: ['advanced intervals', 'chord progressions', 'modulation', 'complex rhythms'],
  4: ['harmony analysis', 'composition techniques', 'music history', 'advanced theory'],
  5: ['counterpoint', 'orchestration', 'jazz theory', 'contemporary music'],
  6: ['advanced harmony', 'composition analysis', 'musicology', 'performance practice'],
  7: ['advanced counterpoint', 'orchestration techniques', 'music analysis', 'historical context'],
  8: ['advanced composition', 'musicology research', 'performance analysis', 'contemporary techniques']
};

// Instruments and their characteristics
const INSTRUMENTS = {
  piano: { range: 'A0-C8', clefs: ['treble', 'bass'], polyphonic: true },
  violin: { range: 'G3-E7', clefs: ['treble'], polyphonic: false },
  guitar: { range: 'E2-E6', clefs: ['treble'], polyphonic: true },
  flute: { range: 'C4-C7', clefs: ['treble'], polyphonic: false }
};

// Generate a new question
router.post('/generate', async (req, res) => {
  try {
    const { instrument, grade } = req.body;
    
    if (!instrument || !grade) {
      return res.status(400).json({ 
        error: 'Instrument and grade are required' 
      });
    }

    if (!INSTRUMENTS[instrument]) {
      return res.status(400).json({ 
        error: 'Invalid instrument. Supported: piano, violin, guitar, flute' 
      });
    }

    if (grade < 1 || grade > 8) {
      return res.status(400).json({ 
        error: 'Grade must be between 1 and 8' 
      });
    }

    console.log(`🎵 Generating question for ${instrument} grade ${grade}`);

    // Generate AI question
    const questionData = await generateQuestion(instrument, grade, AMEB_TOPICS[grade]);
    
    // Create musical notation
    const notationImage = await createNotation(questionData.musicalExample, instrument);
    
    // Generate audio clip
    const audioUrl = await generateAudio(questionData.musicalExample, instrument);
    
    // Save to database
    const savedQuestion = await saveQuestion({
      instrument,
      grade,
      question: questionData.question,
      options: questionData.options,
      correct: questionData.correct,
      explanation: questionData.explanation,
      musicalExample: questionData.musicalExample
    });

    const response = {
      id: savedQuestion.id,
      question: questionData.question,
      options: questionData.options,
      correct: questionData.correct,
      notation_image_base64: notationImage,
      audio_url: audioUrl,
      explanation: questionData.explanation,
      musicalExample: questionData.musicalExample,
      instrument,
      grade,
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ 
      error: 'Failed to generate question',
      message: error.message 
    });
  }
});

// Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const question = await getQuestionById(id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to retrieve question',
      message: error.message 
    });
  }
});

// Get questions by instrument and grade
router.get('/instrument/:instrument/grade/:grade', async (req, res) => {
  try {
    const { instrument, grade } = req.params;
    const questions = await getQuestionsByInstrumentAndGrade(instrument, parseInt(grade));
    res.json(questions);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to retrieve questions',
      message: error.message 
    });
  }
});

// Submit answer and get feedback
router.post('/:id/answer', async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedAnswer } = req.body;
    
    const question = await getQuestionById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const isCorrect = selectedAnswer === question.correct;
    const feedback = {
      isCorrect,
      correctAnswer: question.correct,
      explanation: question.explanation,
      score: isCorrect ? 1 : 0
    };
    
    // Save user's answer
    await saveUserAnswer(id, selectedAnswer, isCorrect);
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process answer',
      message: error.message 
    });
  }
});

module.exports = router; 