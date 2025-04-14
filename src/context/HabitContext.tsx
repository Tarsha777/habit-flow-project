import React, { createContext, useState, useContext, useEffect } from 'react';
import { HabitType, FrequencyType } from '@/types/habit';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { format, isToday, isThisWeek, isThisMonth, isSameDay } from 'date-fns';
import { getHabitRecommendations, HabitRecommendation } from '@/utils/recommendationEngine';

interface HabitContextType {
  habits: HabitType[];
  loading: boolean;
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
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<HabitType[]>([]);
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
    setLoading(false);
  }, []);
  
  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('habits', JSON.stringify(habits));
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
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
            streak: habit.streak + 1 // Increment streak
          };
        }
      }
      return habit;
    }));
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

  // New function to get habit recommendations
  const getRecommendations = (): HabitRecommendation[] => {
    return getHabitRecommendations(habits);
  };
  
  // Add the missing function
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
