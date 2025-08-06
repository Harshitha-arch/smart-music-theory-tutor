import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, User, BarChart3, Home, Menu, X } from 'lucide-react';
import { useQuestionStore } from '../stores/questionStore';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { userProgress } = useQuestionStore();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Questions', href: '/question', icon: Music },
    { name: 'Progress', href: '/progress', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const totalQuestions = userProgress.reduce((sum, p) => sum + p.totalQuestions, 0);
  const totalCorrect = userProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Music Theory Tutor</h1>
              <p className="text-xs text-white text-opacity-70">AI-Powered Learning</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-white text-opacity-70">Overall Accuracy</p>
              <p className="text-sm font-bold text-white">{overallAccuracy}%</p>
            </div>
            <div className="w-20 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                style={{ width: `${overallAccuracy}%` }}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-white border-opacity-20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Progress */}
              <div className="px-4 py-3 bg-white bg-opacity-10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white text-opacity-70">Accuracy</span>
                  <span className="text-sm font-bold text-white">{overallAccuracy}%</span>
                </div>
                <div className="w-full h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                    style={{ width: `${overallAccuracy}%` }}
                  />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 