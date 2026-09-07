export interface Changelog {
  id: string;
  version: string;
  date: string;
  content: string;
}

export interface FeedbackData {
  type: 'bug' | 'feature';
  title: string;
  description: string;
}

export interface PromptData {
  id: string;
  category: string;
  title: string;
  goal: string;
  prompt: string;
  explanation: string;
}

export interface TimerData {
  id: string;
  taskName: string;
  workMinutes: number;
  breakMinutes: number;
  isActive?: boolean;
  isWorkMode?: boolean;
  timeLeft?: number;
  lastUpdated?: number;
}
