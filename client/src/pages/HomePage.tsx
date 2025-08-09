import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Music, Music2, Music3, Music4, Star, Trophy, Target } from 'lucide-react';
import { useQuestionStore } from '../stores/questionStore';
import { realAPI } from '../services/api';
import toast from 'react-hot-toast';
import PracticeMode from '../components/PracticeMode';

const HomePage: React.FC = () => {
  const {
    selectedInstrument,
    selectedGrade,
    setInstrument,
    setGrade,
    setCurrentQuestion,
    setGenerating,
    isGenerating
  } = useQuestionStore();

  const [activeSession, setActiveSession] = useState<any>(null);

  const instruments = [
    { id: 'piano', name: 'Piano', icon: Music, description: 'Classical & Contemporary' },
    { id: 'violin', name: 'Violin', icon: Music2, description: 'String Techniques' },
    { id: 'guitar', name: 'Guitar', icon: Music3, description: 'Folk & Rock' },
    { id: 'flute', name: 'Flute', icon: Music4, description: 'Woodwind Mastery' },
  ];

  const grades = [
    { level: 1, name: 'Beginner', description: 'Basic concepts' },
    { level: 2, name: 'Elementary', description: 'Simple theory' },
    { level: 3, name: 'Intermediate', description: 'Advanced concepts' },
    { level: 4, name: 'Upper Intermediate', description: 'Complex theory' },
    { level: 5, name: 'Advanced', description: 'Professional level' },
    { level: 6, name: 'Upper Advanced', description: 'Expert concepts' },
    { level: 7, name: 'Diploma', description: 'Diploma level' },
    { level: 8, name: 'Licentiate', description: 'Licentiate level' },
  ];

  const handleGenerateQuestion = async () => {
    try {
      setGenerating(true);
      
      // Use mock API for demo purposes
      const question = await realAPI.generateQuestion(selectedInstrument, selectedGrade);
      
      setCurrentQuestion(question);
      toast.success('Question generated successfully!');
      
    } catch (error) {
      console.error('Error generating question:', error);
      toast.error('Failed to generate question. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleStartPracticeSession = (topic: string, instrument: string, grade: number) => {
    const session = {
      id: Date.now().toString(),
      topic,
      instrument,
      grade,
      questionsAnswered: 0,
      correctAnswers: 0,
      timeSpent: 0,
      isActive: true
    };
    setActiveSession(session);
    toast.success('Practice session started!');
  };

  const handleEndPracticeSession = (sessionId: string) => {
    setActiveSession(null);
    toast.success('Practice session ended!');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Master Music Theory
          <span className="text-gradient block">with AI</span>
        </h1>
        <p className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto">
          Learn music theory through interactive questions, beautiful notation, and audio examples. 
          Tailored to your instrument and skill level.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center space-x-2 text-white">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>AMEB Syllabus</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Music className="w-5 h-5 text-purple-400" />
            <span>AI-Generated</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Target className="w-5 h-5 text-green-400" />
            <span>Adaptive Learning</span>
          </div>
        </div>
      </motion.div>

      {/* Instrument Selection */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Instrument</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instruments.map((instrument) => {
            const Icon = instrument.icon;
            const isSelected = selectedInstrument === instrument.id;
            
            return (
              <motion.button
                key={instrument.id}
                onClick={() => setInstrument(instrument.id)}
                className={`card p-6 text-center transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-purple-500 scale-105' : 'hover:scale-105'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-800 mb-1">{instrument.name}</h3>
                <p className="text-sm text-gray-600">{instrument.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Grade Selection */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Your Grade Level</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {grades.map((grade) => {
            const isSelected = selectedGrade === grade.level;
            
            return (
              <motion.button
                key={grade.level}
                onClick={() => setGrade(grade.level)}
                className={`card p-4 text-center transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl font-bold text-blue-600 mb-2">Grade {grade.level}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{grade.name}</h3>
                <p className="text-xs text-gray-600">{grade.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Generate Question Button */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <button
          onClick={handleGenerateQuestion}
          disabled={isGenerating}
          className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="loading-spinner"></div>
              <span>Generating Question...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Generate Question</span>
            </div>
          )}
        </button>
      </motion.div>

      {/* Practice Mode Section */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Practice Mode</h2>
          <p className="text-white text-opacity-90 max-w-2xl mx-auto">
            Focus on specific topics and improve your skills with targeted practice sessions. 
            Track your progress and master music theory concepts systematically.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <PracticeMode
            onStartSession={handleStartPracticeSession}
            onEndSession={handleEndPracticeSession}
            activeSession={activeSession}
          />
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose Our Tutor?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Generated Questions</h3>
            <p className="text-gray-600">
              Each question is uniquely generated by AI, ensuring fresh content and comprehensive coverage of music theory concepts.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AMEB Syllabus</h3>
            <p className="text-gray-600">
              All content follows the Australian Music Examination Board syllabus, ensuring you're learning the right material for your exams.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Adaptive Learning</h3>
            <p className="text-gray-600">
              Our system adapts to your performance, providing questions at the right difficulty level to maximize your learning progress.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage; 