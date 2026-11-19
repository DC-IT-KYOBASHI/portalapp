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

export interface StudyLink {
  label: string;
  url: string;
}

export interface CertificationData {
  id: string;
  title: string;
  category: string;
  level: string;
  examInfo: string;
  fee: string;
  description: string;
  advice: string;
  officialUrl: string;
  applyUrl: string;
  studyLinks: StudyLink[];
}

export interface CertificationsApiResponse {
  updatedAt?: string;
  items: CertificationData[];
}
