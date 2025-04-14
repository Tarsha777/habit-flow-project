
import React, { createContext, useState, useContext, useEffect } from 'react';
import { HabitType, FrequencyType, MoodType, MoodEntry } from '@/types/habit';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { format, isToday, isThisWeek, isThisMonth, isSameDay, subDays, isAfter, differenceInDays } from 'date-fns';
import { getHabitRecommendations, HabitRecommendation } from '@/utils/recommendationEngine';

interface HabitContextType {
  habits: HabitType[];
  loading: boolean;
  moods: MoodEntry[];
  addHabit: (name: string, description: string, frequency: FrequencyType, color?: string, icon?: string) => void;
  deleteHabit: (id: string) => void;
  editHabit: (id: string, updates: Partial<HabitType>) => void;
  completeHabit: (id: string) => void;
  getHabitStreak: (id: string) => number;
  getHabitsForToday: () => HabitType[];
  isHabitCompletedToday: (id: string) => boolean;
  isHabitCompletedOnDate: (id: string, date: Date) => boolean;
  getCompletionPercentage: () => number;
  getRecommendations: () => HabitRecommendation[];
  // New mood tracking functions
  addMoodEntry: (mood: MoodType, note?: string) => void;
  getMoodForDate: (date: Date) => MoodEntry | undefined;
  getMoodTrend: (days: number) => MoodEntry[];
  // Milestone tracking
  checkMilestones: () => void;
  // Smart reminders
  getSmartReminders: () => string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  icon: string;
  condition: () => boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load habits from localStorage
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      try {
        const parsedHabits = JSON.parse(storedHabits) as HabitType[];
        // Convert string dates to Date objects
        const habitsWithDates = parsedHabits.map(habit => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
          completedDates: habit.completedDates.map(date => new Date(date))
        }));
        setHabits(habitsWithDates);
      } catch (error) {
        console.error('Error parsing habits from localStorage', error);
        setHabits([]);
      }
    }

    // Load moods from localStorage
    const storedMoods = localStorage.getItem('moods');
    if (storedMoods) {
      try {
        const parsedMoods = JSON.parse(storedMoods) as MoodEntry[];
        // Convert string dates to Date objects
        const moodsWithDates = parsedMoods.map(mood => ({
          ...mood,
          date: new Date(mood.date)
        }));
        setMoods(moodsWithDates);
      } catch (error) {
        console.error('Error parsing moods from localStorage', error);
        setMoods([]);
      }
    }
    
    setLoading(false);
  }, []);
  
  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, loading]);
  
  // Save moods to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('moods', JSON.stringify(moods));
    }
  }, [moods, loading]);
  
  // Check for milestones whenever habits are updated
  useEffect(() => {
    if (!loading) {
      checkMilestones();
    }
  }, [habits, loading]);
  
  const addHabit = (
    name: string, 
    description: string, 
    frequency: FrequencyType,
    color?: string,
    icon?: string
  ) => {
    const newHabit: HabitType = {
      id: uuidv4(),
      name,
      description,
      frequency,
      createdAt: new Date(),
      completedDates: [],
      streak: 0,
      color,
      icon
    };
    
    setHabits([...habits, newHabit]);
    toast({
      title: "Habit created",
      description: `${name} has been added to your habits.`,
    });
  };
  
  const deleteHabit = (id: string) => {
    const habitToDelete = habits.find(h => h.id === id);
    if (!habitToDelete) return;
    
    setHabits(habits.filter(h => h.id !== id));
    toast({
      title: "Habit deleted",
      description: `${habitToDelete.name} has been removed from your habits.`,
    });
  };
  
  const editHabit = (id: string, updates: Partial<HabitType>) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
    
    toast({
      title: "Habit updated",
      description: "Your habit has been successfully updated.",
    });
  };
  
  const completeHabit = (id: string) => {
    const today = new Date();
    
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        // Check if already completed today
        const completedToday = habit.completedDates.some(date => 
          format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );
        
        if (completedToday) {
          // If already completed today, remove today's completion
          return {
            ...habit,
            completedDates: habit.completedDates.filter(date => 
              format(date, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd')
            ),
            streak: Math.max(0, habit.streak - 1) // Decrement streak
          };
        } else {
          // Add today's completion
          const newStreak = habit.streak + 1;
          const updatedHabit = {
            ...habit,
            completedDates: [...habit.completedDates, today],
            streak: newStreak
          };
          
          // Check if we reached a milestone streak
          if ([7, 21, 30, 50, 100].includes(newStreak)) {
            // Show celebration
            showCelebration(newStreak);
          }
          
          return updatedHabit;
        }
      }
      return habit;
    }));
  };
  
  const showCelebration = (streak: number) => {
    // Import confetti dynamically to avoid SSR issues
    import('canvas-confetti').then((confetti) => {
      const celebrateConfetti = confetti.default;
      
      // Simple confetti animation
      celebrateConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Show a toast for the milestone
      toast({
        title: `🎉 Milestone Reached!`,
        description: `You've maintained a ${streak}-day streak. Keep up the great work!`,
      });
    }).catch(err => {
      console.error('Failed to load confetti', err);
    });
  };
  
  const getHabitStreak = (id: string) => {
    const habit = habits.find(h => h.id === id);
    return habit ? habit.streak : 0;
  };
  
  const getHabitsForToday = () => {
    return habits.filter(habit => {
      switch (habit.frequency) {
        case 'daily':
          return true;
        case 'weekly':
          return isThisWeek(new Date());
        case 'monthly':
          return isThisMonth(new Date());
        default:
          return false;
      }
    });
  };
  
  const isHabitCompletedToday = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return false;
    
    return habit.completedDates.some(date => 
      format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    );
  };
  
  const getCompletionPercentage = () => {
    const todayHabits = getHabitsForToday();
    if (todayHabits.length === 0) return 0;
    
    const completedCount = todayHabits.filter(habit => 
      isHabitCompletedToday(habit.id)
    ).length;
    
    return Math.round((completedCount / todayHabits.length) * 100);
  };

  // AI habit recommendations function
  const getRecommendations = (): HabitRecommendation[] => {
    // Get mood data for personalized recommendations
    const recentMoods = getMoodTrend(7);
    return getHabitRecommendations(habits, recentMoods);
  };
  
  // Mood tracking functions
  const addMoodEntry = (mood: MoodType, note?: string) => {
    const today = new Date();
    
    // Check if we already have a mood entry for today
    const existingMoodIndex = moods.findIndex(m => 
      format(m.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    );
    
    if (existingMoodIndex !== -1) {
      // Update existing mood
      const updatedMoods = [...moods];
      updatedMoods[existingMoodIndex] = {
        ...updatedMoods[existingMoodIndex],
        mood,
        note
      };
      setMoods(updatedMoods);
    } else {
      // Add new mood
      const newMoodEntry: MoodEntry = {
        date: today,
        mood,
        note
      };
      setMoods([...moods, newMoodEntry]);
    }
    
    toast({
      title: "Mood tracked",
      description: `Your mood has been recorded for today.`,
    });
  };
  
  const getMoodForDate = (date: Date): MoodEntry | undefined => {
    return moods.find(mood => 
      format(mood.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };
  
  const getMoodTrend = (days: number): MoodEntry[] => {
    const startDate = subDays(new Date(), days);
    return moods.filter(mood => isAfter(mood.date, startDate));
  };
  
  // Function to check for milestones
  const checkMilestones = () => {
    // Implementation for checking various milestones
    // This would typically trigger celebrations and update achievements
    // For now, we're handling milestone celebrations directly in completeHabit
  };
  
  // Smart reminders
  const getSmartReminders = (): string[] => {
    const reminders: string[] = [];
    const todayHabits = getHabitsForToday();
    const completedTodayCount = todayHabits.filter(habit => 
      isHabitCompletedToday(habit.id)
    ).length;
    
    // If close to completing all habits
    if (completedTodayCount > 0 && completedTodayCount === todayHabits.length - 1) {
      reminders.push("You're just 1 habit away from completing all of today's habits!");
    }
    
    // If user has a good streak going
    const habitWithStreaks = habits.filter(h => h.streak >= 3);
    if (habitWithStreaks.length > 0) {
      // Find habits with streaks but not completed today
      const streakHabitsNotDoneToday = habitWithStreaks.filter(h => !isHabitCompletedToday(h.id));
      
      if (streakHabitsNotDoneToday.length > 0) {
        const habit = streakHabitsNotDoneToday[0]; // Just take the first one
        reminders.push(`Don't break your ${habit.streak}-day streak for "${habit.name}"!`);
      }
    }
    
    // If it's getting late and habits aren't completed
    const currentHour = new Date().getHours();
    if (currentHour >= 20 && completedTodayCount < todayHabits.length) {
      reminders.push("The day is almost over! Take a few minutes to complete your remaining habits.");
    }
    
    return reminders;
  };
  
  // Function to check if habit is completed on a specific date
  const isHabitCompletedOnDate = (id: string, date: Date) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return false;
    
    return habit.completedDates.some(completedDate => 
      isSameDay(completedDate, date)
    );
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        loading,
        moods,
        addHabit,
        deleteHabit,
        editHabit,
        completeHabit,
        getHabitStreak,
        getHabitsForToday,
        isHabitCompletedToday,
        isHabitCompletedOnDate,
        getCompletionPercentage,
        getRecommendations,
        addMoodEntry,
        getMoodForDate,
        getMoodTrend,
        checkMilestones,
        getSmartReminders
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
