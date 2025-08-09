const OpenAI = require('openai');

let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.log('OpenAI API key not configured, using mock data');
  openai = null;
}

// Question templates for different topics
const QUESTION_TEMPLATES = {
  'note recognition': [
    'Identify the note shown in the notation:',
    'What is the name of this note?',
    'Which note is highlighted in this musical example?'
  ],
  'time signatures': [
    'What is the correct time signature for this musical phrase?',
    'Identify the time signature shown in this notation:',
    'Which time signature matches this rhythm pattern?'
  ],
  'intervals': [
    'What is the interval between the two highlighted notes?',
    'Identify the interval shown in this musical example:',
    'What type of interval is this?'
  ],
  'scales': [
    'What scale is being played in this musical example?',
    'Identify the scale type shown in the notation:',
    'Which scale matches this pattern of notes?'
  ],
  'chords': [
    'What chord is shown in this notation?',
    'Identify the chord type in this musical example:',
    'What chord is being played here?'
  ],
  'key signatures': [
    'What key signature is shown in this notation?',
    'Identify the key based on the key signature:',
    'Which key does this key signature represent?'
  ]
};

// Musical examples for different instruments and grades
const MUSICAL_EXAMPLES = {
  piano: {
    1: [
      'C4/4, D4/4, E4/4, F4/4, G4/4',
      'C4/2, D4/2, E4/2, F4/2, G4/2',
      'C4/1, D4/1, E4/1, F4/1, G4/1'
    ],
    2: [
      'C4/4, E4/4, G4/4, C5/4',
      'A3/4, C4/4, E4/4, A4/4',
      'F3/4, A3/4, C4/4, F4/4'
    ],
    3: [
      'C4/4, E4/4, G4/4, B4/4, D5/4',
      'A3/4, C4/4, E4/4, G4/4, B4/4',
      'F3/4, A3/4, C4/4, E4/4, G4/4'
    ]
  },
  violin: {
    1: [
      'G4/4, A4/4, B4/4, C5/4, D5/4',
      'D4/4, E4/4, F#4/4, G4/4, A4/4'
    ],
    2: [
      'G4/4, B4/4, D5/4, G5/4',
      'D4/4, F#4/4, A4/4, D5/4'
    ]
  },
  guitar: {
    1: [
      'E2/4, A2/4, D3/4, G3/4, B3/4, E4/4',
      'A2/4, D3/4, G3/4, B3/4, E4/4, A4/4'
    ],
    2: [
      'E2/4, A2/4, D3/4, G3/4, B3/4, E4/4',
      'A2/4, D3/4, G3/4, B3/4, E4/4, A4/4'
    ]
  },
  flute: {
    1: [
      'C5/4, D5/4, E5/4, F5/4, G5/4',
      'G4/4, A4/4, B4/4, C5/4, D5/4'
    ],
    2: [
      'C5/4, E5/4, G5/4, C6/4',
      'G4/4, B4/4, D5/4, G5/4'
    ]
  }
};

async function generateQuestion(instrument, grade, topics) {
  try {
    // Select a random topic for this grade
    const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
    
    // Get appropriate musical example
    const examples = MUSICAL_EXAMPLES[instrument]?.[grade] || MUSICAL_EXAMPLES[instrument]?.[1] || MUSICAL_EXAMPLES.piano[1];
    const musicalExample = examples[Math.floor(Math.random() * examples.length)];
    
    // Get question template
    const templates = QUESTION_TEMPLATES[selectedTopic] || QUESTION_TEMPLATES['note recognition'];
    const questionTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Generate question using OpenAI or fallback
    if (!openai) {
      // Fallback to mock data when OpenAI is not available
      const mockQuestions = {
        'note recognition': {
          question: `Identify the note shown in this ${instrument} example:`,
          options: { A: "C", B: "D", C: "E", D: "F" },
          correct: "C",
          explanation: `This question tests your ability to recognize notes in ${instrument} music at grade ${grade} level.`
        },
        'time signatures': {
          question: `What is the correct time signature for this ${instrument} phrase?`,
          options: { A: "2/4", B: "3/4", C: "4/4", D: "6/8" },
          correct: "C",
          explanation: `This phrase contains 4 beats per measure, making it a 4/4 time signature.`
        },
        'intervals': {
          question: `What is the interval between the two highlighted notes in this ${instrument} example?`,
          options: { A: "Major 3rd", B: "Perfect 4th", C: "Perfect 5th", D: "Major 6th" },
          correct: "C",
          explanation: `The interval between these notes is a perfect 5th, which is common in ${instrument} music.`
        }
      };
      
      const mockQuestion = mockQuestions[selectedTopic] || mockQuestions['note recognition'];
      
      return {
        ...mockQuestion,
        musicalExample: musicalExample,
        topic: selectedTopic,
        instrument,
        grade
      };
    }

    const prompt = `
You are an expert music theory tutor creating questions for the AMEB (Australian Music Examination Board) syllabus.

Create a multiple choice question for ${instrument} students at grade ${grade} level.

Topic: ${selectedTopic}
Musical example: ${musicalExample}
Question template: ${questionTemplate}

Generate:
1. A clear, educational question
2. Four multiple choice options (A, B, C, D)
3. The correct answer
4. A detailed explanation that teaches the concept

Format your response as JSON:
{
  "question": "the question text",
  "options": {
    "A": "option A",
    "B": "option B", 
    "C": "option C",
    "D": "option D"
  },
  "correct": "A",
  "explanation": "detailed explanation that teaches the concept",
  "musicalExample": "${musicalExample}"
}

Make sure the question is appropriate for grade ${grade} level and the ${instrument} instrument.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert music theory tutor. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    // Parse the JSON response
    let questionData;
    try {
      questionData = JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      questionData = {
        question: `Identify the ${selectedTopic} in this ${instrument} example:`,
        options: {
          A: "Option A",
          B: "Option B", 
          C: "Option C",
          D: "Option D"
        },
        correct: "A",
        explanation: `This question tests your understanding of ${selectedTopic} for ${instrument} at grade ${grade} level.`,
        musicalExample: musicalExample
      };
    }

    // Validate the response
    if (!questionData.question || !questionData.options || !questionData.correct || !questionData.explanation) {
      throw new Error('Invalid question data generated');
    }

    return {
      ...questionData,
      topic: selectedTopic,
      instrument,
      grade
    };

  } catch (error) {
    console.error('Error generating question:', error);
    
    // Fallback question
    return {
      question: `Identify the musical element in this ${instrument} example:`,
      options: {
        A: "Major scale",
        B: "Minor scale", 
        C: "Chromatic scale",
        D: "Pentatonic scale"
      },
      correct: "A",
      explanation: `This question tests your understanding of scales for ${instrument} at grade ${grade} level.`,
      musicalExample: "C4/4, D4/4, E4/4, F4/4, G4/4, A4/4, B4/4, C5/4",
      topic: "scales",
      instrument,
      grade
    };
  }
}

module.exports = {
  generateQuestion
}; 