
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '@/context/HabitContext';
import { useAuth } from '@/context/AuthContext';
import { useAchievements } from '@/context/AchievementContext';
import Navbar from '@/components/Navbar';
import AchievementBadge from '@/components/AchievementBadge';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { AchievementCategory } from '@/types/achievement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Achievements: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { unlockedAchievements, inProgressAchievements } = useAchievements();
  const [filter, setFilter] = useState<AchievementCategory | 'all'>('all');
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  const getDisplayName = (category: AchievementCategory | 'all') => {
    const map: Record<string, string> = {
      all: 'All Achievements',
      general: 'General',
      streak: 'Streak',
      health: 'Health',
      mindfulness: 'Mindfulness',
      productivity: 'Productivity',
      learning: 'Learning',
      creativity: 'Creativity'
    };
    return map[category] || category;
  };
  
  const filteredUnlocked = filter === 'all' 
    ? unlockedAchievements 
    : unlockedAchievements.filter(a => a.category === filter);
    
  const filteredInProgress = filter === 'all' 
    ? inProgressAchievements 
    : inProgressAchievements.filter(a => a.category === filter);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-light text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Achievements</h1>
          </div>
          <p className="text-muted-foreground">
            Track your progress and earn badges as you build better habits
          </p>
        </div>
        
        {/* Filters */}
        <div className="mb-6 overflow-x-auto scrollbar-none">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all" onClick={() => setFilter('all')}>
                All
              </TabsTrigger>
              <TabsTrigger value="general" onClick={() => setFilter('general')}>
                General
              </TabsTrigger>
              <TabsTrigger value="streak" onClick={() => setFilter('streak')}>
                Streaks
              </TabsTrigger>
              <TabsTrigger value="health" onClick={() => setFilter('health')}>
                Health
              </TabsTrigger>
              <TabsTrigger value="mindfulness" onClick={() => setFilter('mindfulness')}>
                Mindfulness
              </TabsTrigger>
              <TabsTrigger value="productivity" onClick={() => setFilter('productivity')}>
                Productivity
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Unlocked Achievements */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Unlocked ({filteredUnlocked.length})
          </h2>
          
          {filteredUnlocked.length === 0 ? (
            <div className="bg-accent/30 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No achievements unlocked yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete habits and maintain streaks to earn achievements
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {filteredUnlocked.map((achievement) => (
                <div key={achievement.id} className="flex flex-col items-center gap-2">
                  <AchievementBadge 
                    achievement={achievement} 
                    size="lg" 
                  />
                  <span className="text-xs text-center font-medium">
                    {achievement.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* In Progress Achievements */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            In Progress ({filteredInProgress.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInProgress.map((achievement) => (
              <div 
                key={achievement.id} 
                className="border rounded-lg p-4 flex items-center gap-4"
              >
                <AchievementBadge 
                  achievement={achievement} 
                  showTooltip={false}
                />
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="bg-accent/50 h-1.5 rounded-full flex-1">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ 
                          width: `${achievement.progress ? achievement.progress * 100 : 0}%`,
                          backgroundColor: achievement.color 
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {achievement.progress ? Math.round(achievement.progress * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
