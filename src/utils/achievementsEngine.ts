
import { Achievement, AchievementCategory } from '@/types/achievement';
import { HabitType } from '@/types/habit';
import { v4 as uuidv4 } from 'uuid';

// Define all achievements
export const ACHIEVEMENTS: Achievement[] = [
  // General achievements
  {
    id: uuidv4(),
    title: 'First Step',
    description: 'Complete your first habit',
    category: 'general',
    icon: 'check-circle',
    color: '#4CAF50',
    condition: { type: 'completion', value: 1 },
  },
  {
    id: uuidv4(),
    title: 'Getting Started',
    description: 'Complete 10 habits',
    category: 'general',
    icon: 'rocket',
    color: '#FF9800',
    condition: { type: 'completion', value: 10 },
  },
  {
    id: uuidv4(),
    title: 'Habit Master',
    description: 'Complete 100 habits',
    category: 'general',
    icon: 'award',
    color: '#2196F3',
    condition: { type: 'completion', value: 100 },
  },
  
  // Streak achievements
  {
    id: uuidv4(),
    title: 'Consistency Beginner',
    description: 'Maintain a 3-day streak',
    category: 'streak',
    icon: 'flame',
    color: '#FF5722',
    condition: { type: 'streak', value: 3 },
  },
  {
    id: uuidv4(),
    title: 'Consistency Builder',
    description: 'Maintain a 7-day streak',
    category: 'streak',
    icon: 'flame',
    color: '#E91E63',
    condition: { type: 'streak', value: 7 },
  },
  {
    id: uuidv4(),
    title: 'Consistency Champion',
    description: 'Maintain a 30-day streak',
    category: 'streak',
    icon: 'trophy',
    color: '#9C27B0',
    condition: { type: 'streak', value: 30 },
  },
  
  // Category achievements
  {
    id: uuidv4(),
    title: 'Health Enthusiast',
    description: 'Complete 5 health habits',
    category: 'health',
    icon: 'heart',
    color: '#F44336',
    condition: { type: 'category', value: 5, categoryName: 'health' },
  },
  {
    id: uuidv4(),
    title: 'Health Guru',
    description: 'Complete 10 health habits',
    category: 'health',
    icon: 'dumbbell',
    color: '#E91E63',
    condition: { type: 'category', value: 10, categoryName: 'health' },
  },
  {
    id: uuidv4(),
    title: 'Mindfulness Beginner',
    description: 'Complete 5 mindfulness habits',
    category: 'mindfulness',
    icon: 'brain',
    color: '#9C27B0',
    condition: { type: 'category', value: 5, categoryName: 'mindfulness' },
  },
  {
    id: uuidv4(),
    title: 'Zen Master',
    description: 'Complete 10 mindfulness habits',
    category: 'mindfulness',
    icon: 'lotus',
    color: '#673AB7',
    condition: { type: 'category', value: 10, categoryName: 'mindfulness' },
  },
  {
    id: uuidv4(),
    title: 'Productivity Starter',
    description: 'Complete 10 productivity habits',
    category: 'productivity',
    icon: 'check-square',
    color: '#3F51B5',
    condition: { type: 'category', value: 10, categoryName: 'productivity' },
  },
  {
    id: uuidv4(),
    title: 'Productivity Pro',
    description: 'Complete 30 productivity habits',
    category: 'productivity',
    icon: 'zap',
    color: '#2196F3',
    condition: { type: 'category', value: 30, categoryName: 'productivity' },
  },
];

/**
 * Check if user unlocked new achievements
 */
export function checkAchievements(
  habits: HabitType[],
  userAchievements: Achievement[]
): Achievement[] {
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
  const maxStreak = Math.max(...habits.map(h => h.streak));
  
  // Count completions by category
  const categoryCompletions: Record<string, number> = {};
  habits.forEach(habit => {
    const category = inferHabitCategory(habit);
    if (category) {
      categoryCompletions[category] = (categoryCompletions[category] || 0) + habit.completedDates.length;
    }
  });
  
  // Get IDs of already unlocked achievements
  const unlockedIds = new Set(userAchievements.filter(a => a.unlockedAt).map(a => a.id));
  
  // Check each achievement
  const newUnlocked = ACHIEVEMENTS
    .filter(achievement => !unlockedIds.has(achievement.id))
    .map(achievement => {
      const { condition } = achievement;
      let isUnlocked = false;
      let progress = 0;
      
      if (condition.type === 'completion') {
        isUnlocked = totalCompletions >= condition.value;
        progress = Math.min(1, totalCompletions / condition.value);
      }
      else if (condition.type === 'streak') {
        isUnlocked = maxStreak >= condition.value;
        progress = Math.min(1, maxStreak / condition.value);
      }
      else if (condition.type === 'category' && condition.categoryName) {
        const categoryCount = categoryCompletions[condition.categoryName] || 0;
        isUnlocked = categoryCount >= condition.value;
        progress = Math.min(1, categoryCount / condition.value);
      }
      
      if (isUnlocked) {
        return {
          ...achievement,
          unlockedAt: new Date(),
          progress: 1
        };
      } else {
        return {
          ...achievement,
          progress
        };
      }
    });
  
  return newUnlocked;
}

/**
 * Infer habit category - reusing logic from recommendationEngine
 */
function inferHabitCategory(habit: HabitType): string | null {
  const text = `${habit.name} ${habit.description || ''}`.toLowerCase();
  
  if (/exercise|gym|workout|run|walk|fitness|health|water|hydrate|sleep|diet/.test(text)) {
    return 'health';
  }
  
  if (/meditation|mindful|breathe|relax|journal|gratitude|reflect/.test(text)) {
    return 'mindfulness';
  }
  
  if (/read|learn|study|course|skill|language|book/.test(text)) {
    return 'learning';
  }
  
  if (/work|productivity|goal|plan|organize|schedule|project|task/.test(text)) {
    return 'productivity';
  }
  
  if (/create|write|draw|paint|music|art|craft|design/.test(text)) {
    return 'creativity';
  }
  
  return null;
}
