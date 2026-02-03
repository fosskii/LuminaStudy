
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  PREMIUM = 'premium'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  status: 'active' | 'disabled';
  isFlagged: boolean;
  studyHoursPerDay: number;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  priority: number; // 1 to 5
}

export interface StudyBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  topic: string;
  durationMinutes: number;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  blocks: StudyBlock[];
}

export interface Stats {
  totalTasks: number;
  completedTasks: number;
  activePlan: boolean;
  premiumStatus: boolean;
}
