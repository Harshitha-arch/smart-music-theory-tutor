import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Award, Star, Calendar, Music } from 'lucide-react';
import { useQuestionStore } from '../stores/questionStore';
import Leaderboard from '../components/Leaderboard';

const ProgressPage: React.FC = () => {
  const { userProgress } = useQuestionStore();
  const [selectedInstrument, setSelectedInstrument] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  // Mock leaderboard data
  const leaderboardEntries = [
    { id: '1', username: 'MusicMaster', instrument: 'piano', grade: 3, accuracyRate: 95, totalQuestions: 25, score: 2375 },
    { id: '2', username: 'ViolinVirtuoso', instrument: 'violin', grade: 2, accuracyRate: 92, totalQuestions: 20, score: 1840 },
    { id: '3', username: 'GuitarGuru', instrument: 'guitar', grade: 4, accuracyRate: 88, totalQuestions: 30, score: 2640 },
    { id: '4', username: 'FluteFanatic', instrument: 'flute', grade: 1, accuracyRate: 100, totalQuestions: 15, score: 1500 },
    { id: '5', username: 'PianoPro', instrument: 'piano', grade: 5, accuracyRate: 85, totalQuestions: 35, score: 2975 },
    { id: '6', username: 'demo-user', instrument: 'piano', grade: 2, accuracyRate: 80, totalQuestions: 5, score: 400 },
  ];

  // Mock achievements data
  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first question', earned: true, icon: Star },
    { id: 2, name: 'Piano Master', description: 'Complete 10 piano questions', earned: userProgress.some(p => p.instrument === 'piano' && p.totalQuestions >= 10), icon: Music },
    { id: 3, name: 'Grade 2 Graduate', description: 'Complete 5 Grade 2 questions', earned: userProgress.some(p => p.grade === 2 && p.totalQuestions >= 5), icon: Trophy },
    { id: 4, name: 'Perfect Score', description: 'Get 100% accuracy on 5 questions', earned: userProgress.some(p => p.accuracyRate === 100 && p.totalQuestions >= 5), icon: Award },
    { id: 5, name: 'Multi-Instrument', description: 'Practice with 3 different instruments', earned: new Set(userProgress.map(p => p.instrument)).size >= 3, icon: Target },
  ];

  // Calculate overall statistics
  const totalQuestions = userProgress.reduce((sum, p) => sum + p.totalQuestions, 0);
  const totalCorrect = userProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const earnedAchievements = achievements.filter(a => a.earned).length;

  // Filter progress based on selections
  const filteredProgress = userProgress.filter(p => {
    if (selectedInstrument !== 'all' && p.instrument !== selectedInstrument) return false;
    if (selectedGrade !== null && p.grade !== selectedGrade) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h1>
      </motion.div>

      {/* Overall Statistics */}
      <motion.div
        className="grid md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-800">{totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Accuracy Rate</p>
              <p className="text-2xl font-bold text-gray-800">{overallAccuracy}%</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-gray-800">{earnedAchievements}/{achievements.length}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Last Activity</p>
              <p className="text-lg font-semibold text-gray-800">
                {userProgress.length > 0 
                  ? new Date(userProgress[userProgress.length - 1].lastActivity).toLocaleDateString()
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Instruments</option>
            <option value="piano">Piano</option>
            <option value="violin">Violin</option>
            <option value="guitar">Guitar</option>
            <option value="flute">Flute</option>
          </select>

          <select
            value={selectedGrade || ''}
            onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Grades</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Progress Details and Leaderboard */}
      <motion.div
        className="grid lg:grid-cols-2 gap-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Progress by Instrument/Grade */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Details</h2>
          {filteredProgress.length > 0 ? (
            <div className="space-y-4">
              {filteredProgress.map((progress, index) => (
                <motion.div
                  key={`${progress.instrument}-${progress.grade}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">{progress.instrument}</p>
                    <p className="text-sm text-gray-600">Grade {progress.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{progress.totalQuestions} questions</p>
                    <p className="text-sm text-gray-600">{progress.accuracyRate}% accuracy</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No progress data available</p>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <IconComponent 
                    className={`w-5 h-5 ${
                      achievement.earned ? 'text-green-500' : 'text-gray-400'
                    }`} 
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${
                      achievement.earned ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </p>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Award className="w-4 h-4 text-green-500" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Leaderboard entries={leaderboardEntries} currentUser="demo-user" />
      </motion.div>
    </div>
  );
};

export default ProgressPage; 