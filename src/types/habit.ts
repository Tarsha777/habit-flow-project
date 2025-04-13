
export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export interface HabitType {
  id: string;
  name: string;
  description?: string;
  frequency: FrequencyType;
  createdAt: Date;
  completedDates: Date[];
  streak: number;
  color?: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
