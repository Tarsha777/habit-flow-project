
import { HabitType, FrequencyType } from '@/types/habit';

// Types for recommendations
export interface HabitRecommendation {
  name: string;
  description: string;
  frequency: FrequencyType;
  category: string;
  icon?: string;
  color?: string;
}

// Categories of habits
const HABIT_CATEGORIES = {
  HEALTH: 'health',
  PRODUCTIVITY: 'productivity',
  MINDFULNESS: 'mindfulness',
  LEARNING: 'learning',
  CREATIVITY: 'creativity',
};

// List of recommendation templates
const recommendationTemplates: HabitRecommendation[] = [
  {
    name: 'Morning Meditation',
    description: 'Start your day with 10 minutes of mindful meditation',
    frequency: 'daily',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: 'brain',
    color: '#9C27B0', // purple
  },
  {
    name: 'Read for 30 Minutes',
    description: 'Dedicate time to reading books or articles',
    frequency: 'daily',
    category: HABIT_CATEGORIES.LEARNING,
    icon: 'book-open',
    color: '#2196F3', // blue
  },
  {
    name: 'Drink Water',
    description: 'Drink at least 8 glasses of water throughout the day',
    frequency: 'daily',
    category: HABIT_CATEGORIES.HEALTH,
    icon: 'cup-water',
    color: '#03A9F4', // light blue
  },
  {
    name: 'Exercise',
    description: 'At least 30 minutes of physical activity',
    frequency: 'daily',
    category: HABIT_CATEGORIES.HEALTH,
    icon: 'dumbbell',
    color: '#F44336', // red
  },
  {
    name: 'Gratitude Journal',
    description: 'Write down 3 things you're grateful for',
    frequency: 'daily',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: 'pen-line',
    color: '#4CAF50', // green
  },
  {
    name: 'Weekly Planning',
    description: 'Plan your week ahead to stay organized',
    frequency: 'weekly',
    category: HABIT_CATEGORIES.PRODUCTIVITY,
    icon: 'calendar-check',
    color: '#FF9800', // orange
  },
  {
    name: 'Learn Something New',
    description: 'Dedicate time to learning a new skill',
    frequency: 'weekly',
    category: HABIT_CATEGORIES.LEARNING,
    icon: 'lightbulb',
    color: '#FFEB3B', // yellow
  },
  {
    name: 'Digital Detox',
    description: 'Take a break from screens for at least 3 hours',
    frequency: 'weekly',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: 'smartphone-off',
    color: '#607D8B', // blue grey
  },
  {
    name: 'Monthly Goal Review',
    description: 'Review and adjust your goals for the next month',
    frequency: 'monthly',
    category: HABIT_CATEGORIES.PRODUCTIVITY,
    icon: 'target',
    color: '#E91E63', // pink
  },
];

/**
 * Analyzes habits and provides recommendations based on user behavior
 */
export function getHabitRecommendations(
  currentHabits: HabitType[],
  limit: number = 3
): HabitRecommendation[] {
  // If user has no habits, suggest starter habits
  if (currentHabits.length === 0) {
    return recommendationTemplates.slice(0, limit);
  }
  
  // Count habits by category
  const categoryCount: Record<string, number> = {};
  const frequencyCount: Record<FrequencyType, number> = {
    daily: 0,
    weekly: 0,
    monthly: 0
  };
  
  // Extract habit names to avoid duplicates
  const existingHabitNames = currentHabits.map(h => h.name.toLowerCase());
  
  // Analyze current habits (this is a simple version)
  currentHabits.forEach(habit => {
    // Infer category from habit name/description (simplified)
    let category = inferHabitCategory(habit);
    
    if (category) {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
    
    // Track frequency distribution
    frequencyCount[habit.frequency]++;
  });
  
  // Find underrepresented categories
  const underrepresentedCategories = Object.values(HABIT_CATEGORIES).filter(
    category => !categoryCount[category] || categoryCount[category] < 2
  );
  
  // Prioritize recommendations
  let recommendations = [...recommendationTemplates]
    // Remove habits the user already has
    .filter(rec => !existingHabitNames.includes(rec.name.toLowerCase()))
    // Sort by prioritizing underrepresented categories
    .sort((a, b) => {
      const aIsUnderrepresented = underrepresentedCategories.includes(a.category);
      const bIsUnderrepresented = underrepresentedCategories.includes(b.category);
      
      if (aIsUnderrepresented && !bIsUnderrepresented) return -1;
      if (!aIsUnderrepresented && bIsUnderrepresented) return 1;
      return 0;
    });
  
  return recommendations.slice(0, limit);
}

/**
 * Infer category from habit details - simple rule-based approach
 */
function inferHabitCategory(habit: HabitType): string | null {
  const text = `${habit.name} ${habit.description || ''}`.toLowerCase();
  
  if (/exercise|gym|workout|run|walk|fitness|health|water|hydrate|sleep|diet/.test(text)) {
    return HABIT_CATEGORIES.HEALTH;
  }
  
  if (/meditation|mindful|breathe|relax|journal|gratitude|reflect/.test(text)) {
    return HABIT_CATEGORIES.MINDFULNESS;
  }
  
  if (/read|learn|study|course|skill|language|book/.test(text)) {
    return HABIT_CATEGORIES.LEARNING;
  }
  
  if (/work|productivity|goal|plan|organize|schedule|project|task/.test(text)) {
    return HABIT_CATEGORIES.PRODUCTIVITY;
  }
  
  if (/create|write|draw|paint|music|art|craft|design/.test(text)) {
    return HABIT_CATEGORIES.CREATIVITY;
  }
  
  return null;
}
