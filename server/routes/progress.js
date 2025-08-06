const express = require('express');
const router = express.Router();
const { 
  getUserProgress, 
  updateProgress, 
  getQuestionStats 
} = require('../services/databaseService');

// Get user progress
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { instrument, grade } = req.query;
    
    const progress = await getUserProgress(userId, instrument, grade);
    
    res.json({
      userId,
      progress: progress.map(p => ({
        instrument: p.instrument,
        grade: p.grade,
        totalQuestions: p.total_questions,
        correctAnswers: p.correct_answers,
        accuracyRate: p.accuracy_rate,
        lastActivity: p.last_activity
      }))
    });
    
  } catch (error) {
    console.error('Error getting user progress:', error);
    res.status(500).json({ 
      error: 'Failed to get user progress',
      message: error.message 
    });
  }
});

// Update user progress
router.post('/update', async (req, res) => {
  try {
    const { userId, instrument, grade, isCorrect } = req.body;
    
    if (!userId || !instrument || !grade || typeof isCorrect !== 'boolean') {
      return res.status(400).json({ 
        error: 'userId, instrument, grade, and isCorrect are required' 
      });
    }
    
    await updateProgress(userId, instrument, grade, isCorrect);
    
    res.json({
      message: 'Progress updated successfully',
      data: { userId, instrument, grade, isCorrect }
    });
    
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ 
      error: 'Failed to update progress',
      message: error.message 
    });
  }
});

// Get progress analytics
router.get('/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { instrument, grade } = req.query;
    
    const progress = await getUserProgress(userId, instrument, grade);
    
    // Calculate analytics
    const totalQuestions = progress.reduce((sum, p) => sum + p.total_questions, 0);
    const totalCorrect = progress.reduce((sum, p) => sum + p.correct_answers, 0);
    const overallAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
    
    // Group by instrument
    const byInstrument = progress.reduce((acc, p) => {
      if (!acc[p.instrument]) {
        acc[p.instrument] = [];
      }
      acc[p.instrument].push(p);
      return acc;
    }, {});
    
    // Group by grade
    const byGrade = progress.reduce((acc, p) => {
      if (!acc[p.grade]) {
        acc[p.grade] = [];
      }
      acc[p.grade].push(p);
      return acc;
    }, {});
    
    res.json({
      userId,
      analytics: {
        totalQuestions,
        totalCorrect,
        overallAccuracy,
        byInstrument,
        byGrade,
        recentActivity: progress.slice(0, 10) // Last 10 activities
      }
    });
    
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ 
      error: 'Failed to get analytics',
      message: error.message 
    });
  }
});

// Get question statistics
router.get('/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const stats = await getQuestionStats(questionId);
    
    res.json({
      questionId,
      stats: {
        totalAttempts: stats.total_attempts || 0,
        correctAttempts: stats.correct_attempts || 0,
        successRate: stats.success_rate || 0
      }
    });
    
  } catch (error) {
    console.error('Error getting question stats:', error);
    res.status(500).json({ 
      error: 'Failed to get question statistics',
      message: error.message 
    });
  }
});

// Get leaderboard (top performers)
router.get('/leaderboard', async (req, res) => {
  try {
    const { instrument, grade } = req.query;
    
    // In a real app, you'd query the database for top performers
    // For demo purposes, return mock data
    const leaderboard = [
      {
        userId: 1,
        username: 'music_master',
        instrument: instrument || 'piano',
        grade: grade || 3,
        accuracyRate: 0.95,
        totalQuestions: 50
      },
      {
        userId: 2,
        username: 'violin_virtuoso',
        instrument: instrument || 'violin',
        grade: grade || 4,
        accuracyRate: 0.92,
        totalQuestions: 45
      },
      {
        userId: 3,
        username: 'guitar_genius',
        instrument: instrument || 'guitar',
        grade: grade || 2,
        accuracyRate: 0.88,
        totalQuestions: 40
      }
    ];
    
    res.json({
      leaderboard: leaderboard.sort((a, b) => b.accuracyRate - a.accuracyRate)
    });
    
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ 
      error: 'Failed to get leaderboard',
      message: error.message 
    });
  }
});

// Get achievement badges
router.get('/achievements/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In a real app, you'd calculate achievements based on user progress
    // For demo purposes, return mock achievements
    const achievements = [
      {
        id: 'first_question',
        name: 'First Question',
        description: 'Answered your first question',
        earned: true,
        earnedAt: new Date().toISOString()
      },
      {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Get 100% accuracy on 10 questions',
        earned: false,
        progress: 7 // 7 out of 10
      },
      {
        id: 'instrument_master',
        name: 'Instrument Master',
        description: 'Complete 50 questions on any instrument',
        earned: false,
        progress: 23 // 23 out of 50
      }
    ];
    
    res.json({
      userId,
      achievements
    });
    
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({ 
      error: 'Failed to get achievements',
      message: error.message 
    });
  }
});

module.exports = router; 