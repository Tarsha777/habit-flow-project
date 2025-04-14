
import { HabitType, FrequencyType, MoodEntry, MoodType } from '@/types/habit';

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
    description: 'Write down 3 things you\'re grateful for',
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
  // Mood-based recommendations
  {
    name: '5-Minute Walk Outside',
    description: 'A quick walk to boost your energy and mood',
    frequency: 'daily',
    category: HABIT_CATEGORIES.HEALTH,
    icon: 'footprints',
    color: '#8BC34A', // light green
  },
  {
    name: 'Deep Breathing',
    description: '5 minutes of deep breathing to reduce stress',
    frequency: 'daily',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: 'wind',
    color: '#00BCD4', // cyan
  },
  {
    name: 'Creative Expression',
    description: 'Draw, paint, or write creatively for 15 minutes',
    frequency: 'daily',
    category: HABIT_CATEGORIES.CREATIVITY,
    icon: 'palette',
    color: '#9C27B0', // purple
  },
  {
    name: 'Connect with Someone',
    description: 'Reach out to a friend or family member',
    frequency: 'daily',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: 'message-circle',
    color: '#FF5722', // deep orange
  },
  {
    name: 'Daily Affirmations',
    description: 'Practice positive self-talk for confidence',
    frequency: 'daily',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: 'message-square-quote',
    color: '#673AB7', // deep purple
  },
];

/**
 * Analyzes habits and moods to provide recommendations based on user behavior
 */
export function getHabitRecommendations(
  currentHabits: HabitType[],
  recentMoods: MoodEntry[] = [],
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
  
  // Analyze current habits
  currentHabits.forEach(habit => {
    // Infer category from habit name/description
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
  
  // Analyze mood trends for personalized recommendations
  let moodBasedRecommendations: HabitRecommendation[] = [];
  
  if (recentMoods.length > 0) {
    // Count occurrences of each mood
    const moodCounts: Record<MoodType, number> = {
      happy: 0,
      sad: 0,
      neutral: 0,
      excited: 0,
      stressed: 0
    };
    
    recentMoods.forEach(entry => {
      moodCounts[entry.mood]++;
    });
    
    // Find predominant mood
    const predominantMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([mood]) => mood as MoodType)[0];
    
    // Suggest habits based on mood
    switch (predominantMood) {
      case 'sad':
        moodBasedRecommendations = [
          {
            name: '5-Minute Walk Outside',
            description: 'A quick walk can boost your mood and energy',
            frequency: 'daily',
            category: HABIT_CATEGORIES.HEALTH,
            icon: 'footprints',
            color: '#8BC34A',
          },
          {
            name: 'Connect with Someone',
            description: 'Reaching out to a friend can improve your mood',
            frequency: 'daily',
            category: HABIT_CATEGORIES.MINDFULNESS,
            icon: 'message-circle',
            color: '#FF5722',
          }
        ];
        break;
      case 'stressed':
        moodBasedRecommendations = [
          {
            name: 'Deep Breathing',
            description: 'Take 5 minutes for deep breathing to reduce stress',
            frequency: 'daily',
            category: HABIT_CATEGORIES.MINDFULNESS,
            icon: 'wind',
            color: '#00BCD4',
          },
          {
            name: 'Digital Detox',
            description: 'Take a 30-minute break from screens',
            frequency: 'daily',
            category: HABIT_CATEGORIES.MINDFULNESS,
            icon: 'smartphone-off',
            color: '#607D8B',
          }
        ];
        break;
      case 'neutral':
        moodBasedRecommendations = [
          {
            name: 'Creative Expression',
            description: 'Draw, paint, or write creatively for 15 minutes',
            frequency: 'daily',
            category: HABIT_CATEGORIES.CREATIVITY,
            icon: 'palette',
            color: '#9C27B0',
          }
        ];
        break;
      default:
        // For happy or excited, suggest maintaining those positive habits
        moodBasedRecommendations = [
          {
            name: 'Gratitude Journal',
            description: 'Write down what you\'re grateful for to maintain positivity',
            frequency: 'daily',
            category: HABIT_CATEGORIES.MINDFULNESS,
            icon: 'pen-line',
            color: '#4CAF50',
          }
        ];
    }
  }
  
  // Combine all recommendations, prioritizing mood-based ones
  let recommendations = [
    ...moodBasedRecommendations, 
    ...recommendationTemplates
  ]
    // Remove habits the user already has
    .filter(rec => !existingHabitNames.includes(rec.name.toLowerCase()))
    // Remove duplicates
    .filter((rec, index, self) => 
      index === self.findIndex(r => r.name === rec.name)
    )
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
