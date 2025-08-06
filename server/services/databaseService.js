const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '../database/music_tutor.db');
    this.initDatabase();
  }

  initDatabase() {
    const db = new sqlite3.Database(this.dbPath);
    
    // Create tables
    db.serialize(() => {
      // Questions table
      db.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        instrument TEXT NOT NULL,
        grade INTEGER NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct TEXT NOT NULL,
        explanation TEXT NOT NULL,
        musicalExample TEXT NOT NULL,
        topic TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // User answers table
      db.run(`CREATE TABLE IF NOT EXISTS user_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        question_id INTEGER,
        selected_answer TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (question_id) REFERENCES questions (id)
      )`);

      // Progress tracking table
      db.run(`CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        instrument TEXT NOT NULL,
        grade INTEGER NOT NULL,
        total_questions INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        accuracy_rate REAL DEFAULT 0.0,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);
    });

    db.close();
  }

  async saveQuestion(questionData) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      const { instrument, grade, question, options, correct, explanation, musicalExample, topic } = questionData;
      
      const stmt = db.prepare(`
        INSERT INTO questions (instrument, grade, question, options, correct, explanation, musicalExample, topic)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        instrument,
        grade,
        question,
        JSON.stringify(options),
        correct,
        explanation,
        musicalExample,
        topic
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            ...questionData
          });
        }
        stmt.finalize();
        db.close();
      });
    });
  }

  async getQuestionById(id) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      db.get(
        'SELECT * FROM questions WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            if (row) {
              row.options = JSON.parse(row.options);
            }
            resolve(row);
          }
          db.close();
        }
      );
    });
  }

  async getQuestionsByInstrumentAndGrade(instrument, grade) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      db.all(
        'SELECT * FROM questions WHERE instrument = ? AND grade = ? ORDER BY created_at DESC LIMIT 50',
        [instrument, grade],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            rows.forEach(row => {
              row.options = JSON.parse(row.options);
            });
            resolve(rows);
          }
          db.close();
        }
      );
    });
  }

  async saveUserAnswer(questionId, selectedAnswer, isCorrect, userId = null) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      const stmt = db.prepare(`
        INSERT INTO user_answers (user_id, question_id, selected_answer, is_correct)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run([userId, questionId, selectedAnswer, isCorrect], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
        stmt.finalize();
        db.close();
      });
    });
  }

  async updateProgress(userId, instrument, grade, isCorrect) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      // Get existing progress
      db.get(
        'SELECT * FROM progress WHERE user_id = ? AND instrument = ? AND grade = ?',
        [userId, instrument, grade],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            if (row) {
              // Update existing progress
              const totalQuestions = row.total_questions + 1;
              const correctAnswers = row.correct_answers + (isCorrect ? 1 : 0);
              const accuracyRate = correctAnswers / totalQuestions;
              
              db.run(
                `UPDATE progress 
                 SET total_questions = ?, correct_answers = ?, accuracy_rate = ?, last_activity = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [totalQuestions, correctAnswers, accuracyRate, row.id],
                function(err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve({ updated: true });
                  }
                  db.close();
                }
              );
            } else {
              // Create new progress entry
              db.run(
                `INSERT INTO progress (user_id, instrument, grade, total_questions, correct_answers, accuracy_rate)
                 VALUES (?, ?, ?, 1, ?, ?)`,
                [userId, instrument, grade, isCorrect ? 1 : 0, isCorrect ? 1.0 : 0.0],
                function(err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve({ created: true });
                  }
                  db.close();
                }
              );
            }
          }
        }
      );
    });
  }

  async getUserProgress(userId, instrument = null, grade = null) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      let query = 'SELECT * FROM progress WHERE user_id = ?';
      const params = [userId];
      
      if (instrument) {
        query += ' AND instrument = ?';
        params.push(instrument);
      }
      
      if (grade) {
        query += ' AND grade = ?';
        params.push(grade);
      }
      
      query += ' ORDER BY last_activity DESC';
      
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
        db.close();
      });
    });
  }

  async getQuestionStats(questionId) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      db.get(
        `SELECT 
           COUNT(*) as total_attempts,
           SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_attempts,
           AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) as success_rate
         FROM user_answers 
         WHERE question_id = ?`,
        [questionId],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
          db.close();
        }
      );
    });
  }

  async createUser(username, email = null) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      const stmt = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
      
      stmt.run([username, email], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, username, email });
        }
        stmt.finalize();
        db.close();
      });
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
        db.close();
      });
    });
  }
}

// Export singleton instance
const databaseService = new DatabaseService();

module.exports = {
  saveQuestion: (data) => databaseService.saveQuestion(data),
  getQuestionById: (id) => databaseService.getQuestionById(id),
  getQuestionsByInstrumentAndGrade: (instrument, grade) => databaseService.getQuestionsByInstrumentAndGrade(instrument, grade),
  saveUserAnswer: (questionId, selectedAnswer, isCorrect, userId) => databaseService.saveUserAnswer(questionId, selectedAnswer, isCorrect, userId),
  updateProgress: (userId, instrument, grade, isCorrect) => databaseService.updateProgress(userId, instrument, grade, isCorrect),
  getUserProgress: (userId, instrument, grade) => databaseService.getUserProgress(userId, instrument, grade),
  getQuestionStats: (questionId) => databaseService.getQuestionStats(questionId),
  createUser: (username, email) => databaseService.createUser(username, email),
  getUserById: (id) => databaseService.getUserById(id)
}; 