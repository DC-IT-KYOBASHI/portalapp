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
