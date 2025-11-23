export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice';
  choices: Choice[];
  explanation?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
  createdAt: string;
  isActive: boolean;
  teacherId: string;
  accessCode: string;
}

export interface TestSession {
  id: string;
  studentId: string;
  testId: string;
  answers: Record<string, string>; // questionId -> choiceId
  score: number;
  totalQuestions: number;
  completedAt: string;
}
