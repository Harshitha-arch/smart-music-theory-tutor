import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Target, TrendingUp, Award, Star, X } from 'lucide-react';
import { useQuestionStore } from '../stores/questionStore';

const ProgressPage: React.FC = () => {
  const { userProgress, userAnswers } = useQuestionStore();

  const totalQuestions = userProgress.reduce((sum, p) => sum + p.totalQuestions, 0);
  const totalCorrect = userProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const recentAnswers = userAnswers.slice(-10).reverse();

  const achievements = [
    {
      id: 'first_question',
      name: 'First Question',
      description: 'Answered your first question',
      earned: userAnswers.length > 0,
      icon: Star
    },
    {
      id: 'perfect_score',
      name: 'Perfect Score',
      description: 'Get 100% accuracy on 10 questions',
      earned: overallAccuracy === 100 && totalQuestions >= 10,
      icon: Trophy
    },
    {
      id: 'instrument_master',
      name: 'Instrument Master',
      description: 'Complete 50 questions on any instrument',
      earned: totalQuestions >= 50,
      icon: Award
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white mb-4">Your Progress</h1>
        <p className="text-xl text-white text-opacity-90">
          Track your learning journey and celebrate your achievements
        </p>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        className="grid md:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{totalQuestions}</h3>
          <p className="text-gray-600">Total Questions</p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{totalCorrect}</h3>
          <p className="text-gray-600">Correct Answers</p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{overallAccuracy}%</h3>
          <p className="text-gray-600">Accuracy Rate</p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{achievements.filter(a => a.earned).length}</h3>
          <p className="text-gray-600">Achievements</p>
        </div>
      </motion.div>

      {/* Progress by Instrument */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Progress by Instrument</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {userProgress.map((progress) => (
            <div key={`${progress.instrument}-${progress.grade}`} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 capitalize">{progress.instrument}</h3>
                  <p className="text-gray-600">Grade {progress.grade}</p>
                </div>
                <span className="grade-badge">Grade {progress.grade}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Questions Answered</span>
                  <span className="font-semibold">{progress.totalQuestions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Correct Answers</span>
                  <span className="font-semibold">{progress.correctAnswers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-semibold">{Math.round(progress.accuracyRate * 100)}%</span>
                </div>
                
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress.accuracyRate * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="card p-6">
          {recentAnswers.length > 0 ? (
            <div className="space-y-4">
              {recentAnswers.map((answer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {answer.isCorrect ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        Question {answer.questionId}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(answer.answeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No recent activity. Start answering questions to see your progress!</p>
          )}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            
            return (
              <div
                key={achievement.id}
                className={`card p-6 text-center transition-all duration-300 ${
                  achievement.earned ? 'ring-2 ring-yellow-400' : 'opacity-60'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  achievement.earned 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                    : 'bg-gray-200'
                }`}>
                  <Icon className={`w-8 h-8 ${achievement.earned ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{achievement.name}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achievement.earned && (
                  <div className="mt-4">
                    <span className="achievement-badge">Earned!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressPage; 