import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  instrument: string;
  grade: number;
  accuracyRate: number;
  totalQuestions: number;
  score: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUser?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentUser }) => {
  const [selectedInstrument, setSelectedInstrument] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  // Filter entries based on selections
  const filteredEntries = entries.filter(entry => {
    if (selectedInstrument !== 'all' && entry.instrument !== selectedInstrument) return false;
    if (selectedGrade !== null && entry.grade !== selectedGrade) return false;
    return true;
  });

  // Sort by score (accuracy rate * total questions)
  const sortedEntries = filteredEntries.sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Leaderboard</h2>
        <div className="flex space-x-2">
          <select
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Grades</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>
      </div>

      {sortedEntries.length > 0 ? (
        <div className="space-y-3">
          {sortedEntries.slice(0, 10).map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.username === currentUser;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                  isCurrentUser 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(rank)}`}>
                  {getRankIcon(rank)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${isCurrentUser ? 'text-blue-600' : 'text-gray-800'}`}>
                      {entry.username}
                    </span>
                    {isCurrentUser && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="capitalize">{entry.instrument}</span>
                    <span>Grade {entry.grade}</span>
                    <span>{entry.totalQuestions} questions</span>
                    <span>{entry.accuracyRate}% accuracy</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {entry.score}
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No leaderboard data available</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

