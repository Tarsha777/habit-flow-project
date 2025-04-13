
import React, { createContext, useState, useContext, useEffect } from 'react';
import { HabitType } from '@/types/habit';
import { Achievement } from '@/types/achievement';
import { checkAchievements, ACHIEVEMENTS } from '@/utils/achievementsEngine';
import { toast } from '@/hooks/use-toast';
import { useHabits } from './HabitContext';
import confetti from 'canvas-confetti';

interface AchievementContextType {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  inProgressAchievements: Achievement[];
  recentlyUnlocked: Achievement | null;
  checkForNewAchievements: () => void;
  dismissRecentAchievement: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { habits } = useHabits();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement | null>(null);
  
  // Load achievements from localStorage
  useEffect(() => {
    const storedAchievements = localStorage.getItem('achievements');
    if (storedAchievements) {
      try {
        const parsedAchievements = JSON.parse(storedAchievements) as Achievement[];
        // Convert string dates to Date objects
        const achievementsWithDates = parsedAchievements.map(a => ({
          ...a,
          unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
        }));
        setAchievements(achievementsWithDates);
      } catch (error) {
        console.error('Error parsing achievements from localStorage', error);
        setAchievements(ACHIEVEMENTS);
      }
    } else {
      // Initialize with all achievements (locked)
      setAchievements(ACHIEVEMENTS);
    }
  }, []);
  
  // Save achievements to localStorage whenever they change
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(achievements));
    }
  }, [achievements]);
  
  const checkForNewAchievements = () => {
    if (habits.length === 0) return;
    
    const newUnlocked = checkAchievements(habits, achievements);
    
    if (newUnlocked.length > 0) {
      // Find newly unlocked achievements (ones with unlockedAt date)
      const actuallyNewUnlocked = newUnlocked.filter(a => a.unlockedAt);
      
      if (actuallyNewUnlocked.length > 0) {
        // Update the achievements list
        setAchievements(prev => {
          const updatedAchievements = [...prev];
          
          newUnlocked.forEach(newAchievement => {
            const index = updatedAchievements.findIndex(a => a.id === newAchievement.id);
            if (index !== -1) {
              updatedAchievements[index] = newAchievement;
            }
          });
          
          return updatedAchievements;
        });
        
        // Set the most recently unlocked achievement for display
        setRecentlyUnlocked(actuallyNewUnlocked[0]);
        
        // Trigger confetti when achievement unlocked
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };
  
  // Check for new achievements when habits change
  useEffect(() => {
    checkForNewAchievements();
  }, [habits]);
  
  const dismissRecentAchievement = () => {
    setRecentlyUnlocked(null);
  };
  
  // Get unlocked and in-progress achievements
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const inProgressAchievements = achievements.filter(a => !a.unlockedAt);
  
  return (
    <AchievementContext.Provider
      value={{
        achievements,
        unlockedAchievements,
        inProgressAchievements,
        recentlyUnlocked,
        checkForNewAchievements,
        dismissRecentAchievement,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};
