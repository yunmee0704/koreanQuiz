export type NumberSystem = "native" | "sino";

export type ConceptId =
  | "native_counting"
  | "native_age"
  | "native_hours"
  | "sino_minutes"
  | "sino_money"
  | "sino_dates"
  | "sino_phone_numbers"
  | "sino_addresses"
  | "sino_room_numbers"
  | "sino_math";

export type QuestionType =
  | "system_choice"
  | "translate"
  | "multiple_choice"
  | "fill_blank"
  | "error_correction"
  | "sentence_choice"
  | "drag_reorder";

export interface ConceptDefinition {
  id: ConceptId;
  system: NumberSystem;
  englishLabel: string;
  koreanUnit: string;
  numberMin: number;
  numberMax: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  conceptId: ConceptId;
  conceptLabel: string;
  system: NumberSystem;
  prompt: string;
  koreanPrompt: string;
  correctAnswer: string;
  choices?: string[];
  tokens?: string[];
  explanation: string;
  signature: string;
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string;
}

export interface ConceptScore {
  attempts: number;
  correct: number;
  wrongInRow: number;
}

export interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentStreak: number;
}
