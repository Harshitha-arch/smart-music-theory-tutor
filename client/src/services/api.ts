import axios from 'axios';
import { Question, UserProgress } from '../stores/questionStore';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export interface GenerateQuestionRequest {
  instrument: string;
  grade: number;
}

export interface GenerateQuestionResponse {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: string;
  explanation: string;
  notation_image_base64: string;
  audio_url: string;
  musicalExample: string;
  instrument: string;
  grade: number;
  topic?: string;
  timestamp: string;
}

export interface SubmitAnswerRequest {
  selectedAnswer: string;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  score: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  created_at: string;
}

export interface ProgressAnalytics {
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  byInstrument: Record<string, UserProgress[]>;
  byGrade: Record<number, UserProgress[]>;
  recentActivity: UserProgress[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  instrument: string;
  grade: number;
  accuracyRate: number;
  totalQuestions: number;
}

// Question API
export const questionAPI = {
  generate: async (data: GenerateQuestionRequest): Promise<GenerateQuestionResponse> => {
    const response = await api.post('/questions/generate', data);
    return response.data;
  },

  getById: async (id: string): Promise<Question> => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  getByInstrumentAndGrade: async (instrument: string, grade: number): Promise<Question[]> => {
    const response = await api.get(`/questions/instrument/${instrument}/grade/${grade}`);
    return response.data;
  },

  submitAnswer: async (id: string, data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
    const response = await api.post(`/questions/${id}/answer`, data);
    return response.data;
  },
};

// User API
export const userAPI = {
  register: async (data: { username: string; email?: string; password: string }) => {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  login: async (data: { username: string; password: string }) => {
    const response = await api.post('/users/login', data);
    return response.data;
  },

  getProfile: async (userId: string): Promise<UserProfile> => {
    const response = await api.get(`/users/profile?userId=${userId}`);
    return response.data.user;
  },

  updateProfile: async (data: { userId: string; username?: string; email?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getUserProgress: async (userId: string, instrument?: string, grade?: number): Promise<UserProgress[]> => {
    const params = new URLSearchParams();
    if (instrument) params.append('instrument', instrument);
    if (grade) params.append('grade', grade.toString());
    
    const response = await api.get(`/progress/user/${userId}?${params.toString()}`);
    return response.data.progress;
  },

  updateProgress: async (data: { userId: string; instrument: string; grade: number; isCorrect: boolean }) => {
    const response = await api.post('/progress/update', data);
    return response.data;
  },

  getAnalytics: async (userId: string, instrument?: string, grade?: number): Promise<ProgressAnalytics> => {
    const params = new URLSearchParams();
    if (instrument) params.append('instrument', instrument);
    if (grade) params.append('grade', grade.toString());
    
    const response = await api.get(`/progress/analytics/${userId}?${params.toString()}`);
    return response.data.analytics;
  },

  getQuestionStats: async (questionId: string) => {
    const response = await api.get(`/progress/question/${questionId}`);
    return response.data.stats;
  },

  getLeaderboard: async (instrument?: string, grade?: number): Promise<LeaderboardEntry[]> => {
    const params = new URLSearchParams();
    if (instrument) params.append('instrument', instrument);
    if (grade) params.append('grade', grade.toString());
    
    const response = await api.get(`/progress/leaderboard?${params.toString()}`);
    return response.data.leaderboard;
  },

  getAchievements: async (userId: string): Promise<Achievement[]> => {
    const response = await api.get(`/progress/achievements/${userId}`);
    return response.data.achievements;
  },
};

// Mock data for development
export const mockAPI = {
  generateQuestion: (): Promise<GenerateQuestionResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'mock-1',
          question: 'What is the correct time signature for this musical phrase?',
          options: {
            A: '3/4',
            B: '4/4',
            C: '6/8',
            D: '2/4'
          },
          correct: 'B',
          explanation: 'This phrase contains 4 beats per measure, making it a 4/4 time signature. The rhythm pattern shows quarter notes that align with a 4-beat structure.',
          notation_image_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          audio_url: '/audio/mock-audio.wav',
          musicalExample: 'C4/4, D4/4, E4/4, F4/4, G4/4',
          instrument: 'piano',
          grade: 2,
          topic: 'time signatures',
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });
  },

  submitAnswer: (): Promise<SubmitAnswerResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isCorrect: true,
          correctAnswer: 'B',
          explanation: 'Correct! This phrase contains 4 beats per measure, making it a 4/4 time signature.',
          score: 1
        });
      }, 500);
    });
  }
};

export default api; 