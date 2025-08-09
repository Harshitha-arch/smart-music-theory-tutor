import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Target, Timer, CheckCircle } from 'lucide-react';

interface PracticeSession {
  id: string;
  topic: string;
  instrument: string;
  grade: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  isActive: boolean;
}

interface PracticeModeProps {
  onStartSession: (topic: string, instrument: string, grade: number) => void;
  onEndSession: (sessionId: string) => void;
  activeSession?: PracticeSession;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ 
  onStartSession, 
  onEndSession, 
  activeSession 
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('piano');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);

  const practiceTopics = [
    { id: 'scales', name: 'Scales & Arpeggios', description: 'Practice major and minor scales' },
    { id: 'intervals', name: 'Intervals', description: 'Learn to identify musical intervals' },
    { id: 'chords', name: 'Chords & Harmony', description: 'Study chord progressions and harmony' },
    { id: 'rhythm', name: 'Rhythm & Timing', description: 'Practice rhythm patterns and time signatures' },
    { id: 'sight_reading', name: 'Sight Reading', description: 'Improve sight reading skills' },
    { id: 'ear_training', name: 'Ear Training', description: 'Develop your musical ear' },
  ];

  const instruments = [
    { id: 'piano', name: 'Piano', icon: '🎹' },
    { id: 'violin', name: 'Violin', icon: '🎻' },
    { id: 'guitar', name: 'Guitar', icon: '🎸' },
    { id: 'flute', name: 'Flute', icon: '🎵' },
  ];

  const handleStartSession = () => {
    if (selectedTopic) {
      onStartSession(selectedTopic, selectedInstrument, selectedGrade);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800">Practice Mode</h2>
      </div>

      {activeSession ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Active Session</h3>
                <p className="text-purple-100">
                  {practiceTopics.find(t => t.id === activeSession.topic)?.name} - 
                  {instruments.find(i => i.id === activeSession.instrument)?.name} 
                  (Grade {activeSession.grade})
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(activeSession.timeSpent)}</span>
                </div>
                <div className="text-sm text-purple-100">
                  {activeSession.correctAnswers}/{activeSession.questionsAnswered} correct
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onEndSession(activeSession.id)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>End Session</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Continue Practice</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Topic Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose Practice Topic</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {practiceTopics.map((topic) => (
                <motion.button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedTopic === topic.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="font-semibold text-gray-800">{topic.name}</h4>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Instrument and Grade Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instrument</label>
              <select
                value={selectedInstrument}
                onChange={(e) => setSelectedInstrument(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {instruments.map((instrument) => (
                  <option key={instrument.id} value={instrument.id}>
                    {instrument.icon} {instrument.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Session Button */}
          <button
            onClick={handleStartSession}
            disabled={!selectedTopic}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              selectedTopic
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-5 h-5" />
            <span>Start Practice Session</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PracticeMode;
