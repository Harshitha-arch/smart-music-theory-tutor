import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, Check, X, RotateCcw, ArrowRight } from 'lucide-react';
import { useQuestionStore } from '../stores/questionStore';
import { mockAPI } from '../services/api';
import toast from 'react-hot-toast';
import { generateSimpleAudioDataURI } from '../utils/audioGenerator';

const QuestionPage: React.FC = () => {
  const {
    currentQuestion,
    selectedAnswer,
    isAnswered,
    isCorrect,
    showExplanation,
    setSelectedAnswer,
    setAnswered,
    setCorrect,
    setShowExplanation,
    addUserAnswer,
    updateProgress,
    resetQuestion
  } = useQuestionStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    if (currentQuestion?.audio_url) {
      const audio = new Audio();
      
      // Set up event listeners
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setAudioError('Failed to load audio');
        setIsPlaying(false);
      });
      audio.addEventListener('canplaythrough', () => {
        setAudioError(null);
      });
      
      // Set the audio source
      audio.src = currentQuestion.audio_url;
      
      setAudioElement(audio);
      
      // Cleanup function
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [currentQuestion]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    try {
      // Use mock API for demo
      const result = await mockAPI.submitAnswer();
      console.log('Answer submitted:', result);
      
      const isAnswerCorrect = selectedAnswer === currentQuestion.correct;
      
      setAnswered(true);
      setCorrect(isAnswerCorrect);
      setShowExplanation(true);

      // Save user answer
      addUserAnswer({
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect: isAnswerCorrect,
        answeredAt: new Date().toISOString()
      });

      // Update progress
      updateProgress({
        userId: 'demo-user',
        instrument: currentQuestion.instrument,
        grade: currentQuestion.grade,
        totalQuestions: 1,
        correctAnswers: isAnswerCorrect ? 1 : 0,
        accuracyRate: isAnswerCorrect ? 100 : 0,
        lastActivity: new Date().toISOString(),
        isCorrect: isAnswerCorrect
      });

      if (isAnswerCorrect) {
        toast.success('Correct! Well done!');
      } else {
        toast.error(`Incorrect. The correct answer is ${currentQuestion.correct}.`);
      }

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer. Please try again.');
    }
  };

  const handlePlayAudio = async () => {
    if (!audioElement) {
      toast.error('Audio not available');
      return;
    }

    try {
      if (isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
        setIsPlaying(false);
      } else {
        // Reset any previous errors
        setAudioError(null);
        
        console.log('Attempting to play audio:', currentQuestion?.audio_url);
        
        // Try to play the audio
        const playPromise = audioElement.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          console.log('Audio started playing successfully');
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioError('Failed to play audio');
      setIsPlaying(false);
      toast.error('Unable to play audio. Please try again.');
    }
  };

  const handleNextQuestion = () => {
    resetQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-lg">No question available. Please generate a question first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Question Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="grade-badge">Grade {currentQuestion.grade}</span>
            <span className="text-white text-opacity-70 capitalize">{currentQuestion.instrument}</span>
          </div>
          <button
            onClick={resetQuestion}
            className="btn-secondary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Question
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuestion.question}</h2>
      </motion.div>

      {/* Notation and Audio */}
      <motion.div
        className="grid md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Notation */}
        <div className="notation-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Musical Notation</h3>
          {currentQuestion.notation_image_base64 ? (
            <img
              src={currentQuestion.notation_image_base64}
              alt="Musical notation"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Notation not available</span>
            </div>
          )}
        </div>

        {/* Audio Player */}
        <div className="audio-player">
          <h3 className="text-lg font-semibold mb-4">Audio Example</h3>
          <div className="space-y-3">
            <button
              onClick={handlePlayAudio}
              disabled={audioError !== null}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                audioError 
                  ? 'bg-red-500 bg-opacity-20 cursor-not-allowed' 
                  : isPlaying 
                    ? 'bg-green-500 bg-opacity-20 hover:bg-opacity-30' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>Stop Audio</span>
                </>
              ) : audioError ? (
                <>
                  <X className="w-5 h-5 text-red-500" />
                  <span>Audio Unavailable</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Play Audio</span>
                </>
              )}
            </button>
            
            {audioError && (
              <div className="text-sm text-red-500 bg-red-100 bg-opacity-20 p-2 rounded">
                {audioError}
              </div>
            )}
            
            {isPlaying && (
              <div className="text-sm text-green-600 bg-green-100 bg-opacity-20 p-2 rounded">
                Playing audio...
              </div>
            )}
            
            {/* Test Audio Button */}
            <button
              onClick={() => {
                const testAudio = new Audio(generateSimpleAudioDataURI(440, 1));
                testAudio.play().then(() => {
                  toast.success('Test audio played successfully!');
                }).catch((error) => {
                  console.error('Test audio error:', error);
                  toast.error('Test audio failed to play');
                });
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Test Audio
            </button>
          </div>
        </div>
      </motion.div>

      {/* Answer Options */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Answer</h3>
        <div className="grid gap-4">
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            let optionClass = 'question-option';
            
            if (isAnswered) {
              if (key === currentQuestion.correct) {
                optionClass += ' correct';
              } else if (key === selectedAnswer && key !== currentQuestion.correct) {
                optionClass += ' incorrect';
              }
            } else if (key === selectedAnswer) {
              optionClass += ' selected';
            }

            return (
              <motion.button
                key={key}
                onClick={() => handleOptionSelect(key)}
                disabled={isAnswered}
                className={optionClass}
                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                      {key}
                    </div>
                    <span className="text-left">{value}</span>
                  </div>
                  {isAnswered && key === currentQuestion.correct && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                  {isAnswered && key === selectedAnswer && key !== currentQuestion.correct && (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <button
          onClick={handleSubmitAnswer}
          disabled={!selectedAnswer || isAnswered}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnswered ? 'Answer Submitted' : 'Submit Answer'}
        </button>
      </motion.div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            className="card p-6 mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Explanation</h3>
            <p className="text-gray-700 mb-4">{currentQuestion.explanation}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isCorrect ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              
              <button
                onClick={handleNextQuestion}
                className="btn-secondary"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Next Question
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionPage; 