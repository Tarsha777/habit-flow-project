
export type AchievementCategory = 
  | 'general'
  | 'streak'
  | 'health' 
  | 'mindfulness'
  | 'productivity'
  | 'learning'
  | 'creativity';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  color: string;
  condition: AchievementCondition;
  unlockedAt?: Date;
  progress?: number;
}

export type AchievementCondition = {
  type: 'streak' | 'completion' | 'category';
  value: number;
  categoryName?: string;
};
