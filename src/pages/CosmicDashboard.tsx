import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '@/context/HabitContext';
import { useAuth } from '@/context/AuthContext';
import { useAchievements } from '@/context/AchievementContext';
import Navbar from '@/components/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import MeditationSection from '@/components/MeditationSection';
import CosmicMoodTracker from '@/components/CosmicMoodTracker';
import CosmicHabitTracker from '@/components/CosmicHabitTracker';
import CosmicModeToggle from '@/components/CosmicModeToggle';
import HabitForm from '@/components/HabitForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Trophy, Target, Zap } from 'lucide-react';
import AchievementBadge from '@/components/AchievementBadge';

const CosmicDashboard: React.FC = () => {
  const { habits, loading, getCompletionPercentage, getSmartReminders } = useHabits();
  const { user, isLoading } = useAuth();
  const { unlockedAchievements } = useAchievements();
  const navigate = useNavigate();
  
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [cosmicMode, setCosmicMode] = useState<'work' | 'life'>('life');
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const completionPercentage = getCompletionPercentage();
  const smartReminders = getSmartReminders();
  const recentAchievements = unlockedAchievements.slice(0, 3);

  if (isLoading || loading) {
    return (
      <div className="cosmic-background min-h-screen flex items-center justify-center">
        <CosmicBackground />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cosmic-nebula border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-cosmic-moonlight">Aligning the stars...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-background min-h-screen">
      <CosmicBackground />
      <Navbar />
      
      <div className="container mx-auto py-6 px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cosmic-constellation to-cosmic-moonlight bg-clip-text text-transparent mb-2">
            ✨ Cosmic Habit Universe ✨
          </h1>
          <p className="text-cosmic-constellation">
            Where productivity meets inner peace in the vast cosmos
          </p>
        </div>

        {/* Smart Reminders */}
        {smartReminders.length > 0 && (
          <Card className="cosmic-card mb-6 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cosmic-aurora" />
              <span className="font-medium text-cosmic-constellation">Cosmic Messages</span>
            </div>
            {smartReminders.map((reminder, index) => (
              <p key={index} className="text-sm text-muted-foreground mb-1">
                🌟 {reminder}
              </p>
            ))}
          </Card>
        )}

        {/* Mode Toggle */}
        <div className="mb-8">
          <CosmicModeToggle mode={cosmicMode} onModeChange={setCosmicMode} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Meditation & Mood */}
          <div className="space-y-6">
            <MeditationSection />
            <CosmicMoodTracker />
          </div>

          {/* Center Column - Habit Tracker */}
          <div className="lg:col-span-2">
            <CosmicHabitTracker />
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Completion Stats */}
          <Card className="cosmic-card p-6 text-center">
            <div className="relative mb-4">
              <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--cosmic-deep))"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#completionGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${completionPercentage * 2.51} 251`}
                  className="transition-all duration-1000"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--cosmic-constellation))" />
                    <stop offset="100%" stopColor="hsl(var(--cosmic-aurora))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-cosmic-moonlight">{completionPercentage}%</span>
              </div>
            </div>
            <div className="text-sm text-cosmic-constellation">Today's Progress</div>
          </Card>

          {/* Total Habits */}
          <Card className="cosmic-card p-6 text-center">
            <div className="text-3xl font-bold text-cosmic-stardust mb-2">{habits.length}</div>
            <div className="text-sm text-cosmic-constellation flex items-center justify-center gap-1">
              <Target className="w-4 h-4" />
              Active Planets
            </div>
          </Card>

          {/* Best Streak */}
          <Card className="cosmic-card p-6 text-center">
            <div className="text-3xl font-bold text-cosmic-aurora mb-2">
              {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
            </div>
            <div className="text-sm text-cosmic-constellation">Best Orbit</div>
          </Card>

          {/* Achievements */}
          <Card className="cosmic-card p-6 text-center">
            <div className="text-3xl font-bold text-cosmic-moonlight mb-2">{unlockedAchievements.length}</div>
            <div className="text-sm text-cosmic-constellation flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" />
              Constellation Badges
            </div>
          </Card>
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <Card className="cosmic-card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cosmic-constellation">Recent Achievements</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/achievements')}
                className="cosmic-button"
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentAchievements.map(achievement => (
                <div key={achievement.id} className="cosmic-card p-4 flex items-center gap-3">
                  <AchievementBadge achievement={achievement} size="sm" />
                  <div>
                    <div className="font-medium text-cosmic-moonlight">{achievement.title}</div>
                    <div className="text-xs text-cosmic-constellation">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Add Habit Button */}
        <div className="text-center">
          <Button 
            onClick={() => setIsHabitFormOpen(true)} 
            className="cosmic-button gap-2 text-lg px-8 py-4"
          >
            <PlusCircle className="h-6 w-6" />
            Birth a New Cosmic Habit
          </Button>
        </div>
      </div>
      
      <HabitForm
        open={isHabitFormOpen}
        onClose={() => setIsHabitFormOpen(false)}
        editingHabit={null}
      />
    </div>
  );
};

export default CosmicDashboard;