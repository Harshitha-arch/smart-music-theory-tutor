import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
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
  notation_image_base64?: string;
  audio_url?: string;
  musicalExample?: string;
  instrument: string;
  grade: number;
  topic?: string;
  timestamp: string;
}

export interface UserProgress {
  userId: string;
  instrument: string;
  grade: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  lastActivity: string;
  isCorrect?: boolean; // Add this optional property
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  answeredAt: string;
}

interface QuestionState {
  // Current question state
  currentQuestion: Question | null;
  selectedAnswer: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  showExplanation: boolean;
  
  // User progress
  userProgress: UserProgress[];
  userAnswers: UserAnswer[];
  
  // Settings
  selectedInstrument: string;
  selectedGrade: number;
  
  // Loading states
  isLoading: boolean;
  isGenerating: boolean;
  
  // Actions
  setCurrentQuestion: (question: Question | null) => void;
  setSelectedAnswer: (answer: string) => void;
  setAnswered: (answered: boolean) => void;
  setCorrect: (correct: boolean) => void;
  setShowExplanation: (show: boolean) => void;
  addUserAnswer: (answer: UserAnswer) => void;
  updateProgress: (progress: UserProgress) => void;
  setInstrument: (instrument: string) => void;
  setGrade: (grade: number) => void;
  setLoading: (loading: boolean) => void;
  setGenerating: (generating: boolean) => void;
  resetQuestion: () => void;
  clearProgress: () => void;
}

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuestion: null,
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: null,
      showExplanation: false,
      userProgress: [],
      userAnswers: [],
      selectedInstrument: 'piano',
      selectedGrade: 1,
      isLoading: false,
      isGenerating: false,
      
      // Actions
      setCurrentQuestion: (question) => set({ currentQuestion: question }),
      
      setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
      
      setAnswered: (answered) => set({ isAnswered: answered }),
      
      setCorrect: (correct) => set({ isCorrect: correct }),
      
      setShowExplanation: (show) => set({ showExplanation: show }),
      
      addUserAnswer: (answer) => set((state) => ({
        userAnswers: [...state.userAnswers, answer]
      })),
      
      updateProgress: (progress) => set((state) => {
        const existingIndex = state.userProgress.findIndex(
          p => p.instrument === progress.instrument && p.grade === progress.grade
        );
        
        if (existingIndex >= 0) {
          const updated = [...state.userProgress];
          updated[existingIndex] = progress;
          return { userProgress: updated };
        } else {
          return { userProgress: [...state.userProgress, progress] };
        }
      }),
      
      setInstrument: (instrument) => set({ selectedInstrument: instrument }),
      
      setGrade: (grade) => set({ selectedGrade: grade }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setGenerating: (generating) => set({ isGenerating: generating }),
      
      resetQuestion: () => set({
        currentQuestion: null,
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: null,
        showExplanation: false
      }),
      
      clearProgress: () => set({
        userProgress: [],
        userAnswers: []
      })
    }),
    {
      name: 'music-tutor-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        userAnswers: state.userAnswers,
        selectedInstrument: state.selectedInstrument,
        selectedGrade: state.selectedGrade
      })
    }
  )
); 