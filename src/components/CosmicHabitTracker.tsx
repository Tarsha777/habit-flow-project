import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/context/HabitContext';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Calendar } from 'lucide-react';

const CosmicHabitTracker: React.FC = () => {
  const { habits, completeHabit, isHabitCompletedToday } = useHabits();

  const getTodayCompletions = () => {
    return habits.filter(habit => isHabitCompletedToday(habit.id));
  };

  const getPlanetSize = (streak: number) => {
    if (streak >= 30) return 'w-20 h-20 text-2xl';
    if (streak >= 14) return 'w-16 h-16 text-xl';
    if (streak >= 7) return 'w-14 h-14 text-lg';
    return 'w-12 h-12 text-base';
  };

  const getPlanetColor = (habit: any, isCompleted: boolean) => {
    if (isCompleted) {
      return 'planet-habit completed';
    }
    return 'planet-habit incomplete';
  };

  const completedToday = getTodayCompletions();
  const completionRate = habits.length > 0 ? (completedToday.length / habits.length) * 100 : 0;

  return (
    <Card className="cosmic-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-solar to-cosmic-constellation flex items-center justify-center">
            🪐
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-cosmic-constellation to-cosmic-moonlight bg-clip-text text-transparent">
            Cosmic Habit Solar System
          </h2>
        </div>
        <Badge variant="secondary" className="bg-cosmic-deep text-cosmic-moonlight">
          {completedToday.length}/{habits.length} Planets Glowing
        </Badge>
      </div>

      {/* Solar System Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="cosmic-card p-4 text-center">
          <div className="text-2xl font-bold text-cosmic-constellation">{completionRate.toFixed(0)}%</div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Target className="w-3 h-3" />
            System Energy
          </div>
        </div>
        <div className="cosmic-card p-4 text-center">
          <div className="text-2xl font-bold text-cosmic-aurora">{completedToday.length}</div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" />
            Active Planets
          </div>
        </div>
        <div className="cosmic-card p-4 text-center">
          <div className="text-2xl font-bold text-cosmic-moonlight">
            {habits.reduce((max, h) => Math.max(max, h.streak), 0)}
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            Longest Orbit
          </div>
        </div>
      </div>

      {/* Habit Planets */}
      <div className="space-y-6">
        {habits.map((habit) => {
          const isCompletedToday = isHabitCompletedToday(habit.id);

          return (
            <div key={habit.id} className="relative">
              <div className="flex items-center justify-between p-4 cosmic-card">
                <div className="flex items-center gap-4">
                  {/* Planet */}
                  <button
                    onClick={() => completeHabit(habit.id)}
                    className={`${getPlanetSize(habit.streak)} ${getPlanetColor(habit, isCompletedToday)} flex items-center justify-center`}
                  >
                    {habit.icon}
                  </button>

                  {/* Habit Info */}
                  <div>
                    <h3 className="font-semibold text-foreground">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        🔥 {habit.streak} day orbit
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        📅 {habit.frequency}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Saturn Rings for Streaks */}
                {habit.streak >= 7 && (
                  <div className="absolute -inset-2 border-2 border-cosmic-constellation rounded-full opacity-30 animate-pulse" />
                )}
                {habit.streak >= 14 && (
                  <div className="absolute -inset-4 border border-cosmic-aurora rounded-full opacity-20 animate-pulse" />
                )}
                {habit.streak >= 30 && (
                  <div className="absolute -inset-6 border border-cosmic-moonlight rounded-full opacity-10 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌌</div>
          <h3 className="text-lg font-medium text-cosmic-constellation mb-2">
            Your Solar System Awaits
          </h3>
          <p className="text-muted-foreground">
            Create your first habit to begin your cosmic journey
          </p>
        </div>
      )}
    </Card>
  );
};

export default CosmicHabitTracker;