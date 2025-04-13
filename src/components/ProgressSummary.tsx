
import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ProgressSummary: React.FC = () => {
  const { getHabitsForToday, getCompletionPercentage, isHabitCompletedToday } = useHabits();
  
  const todayHabits = getHabitsForToday();
  const completionPercentage = getCompletionPercentage();
  const completedHabits = todayHabits.filter(habit => isHabitCompletedToday(habit.id)).length;
  
  // Get motivational message based on completion percentage
  const getMotivationalMessage = () => {
    if (completionPercentage === 0) return "Let's start your day with some habits!";
    if (completionPercentage < 25) return "Good start, keep going!";
    if (completionPercentage < 50) return "You're making progress!";
    if (completionPercentage < 75) return "You're doing great today!";
    if (completionPercentage < 100) return "Almost there, keep it up!";
    return "Awesome! You've completed all your habits today!";
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Today's Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {completedHabits} of {todayHabits.length} habits completed
            </span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className={cn(
          "p-3 rounded-md text-center text-sm",
          completionPercentage === 100 
            ? "bg-status-completed/10 text-status-completed" 
            : "bg-habit-primary/10 text-habit-primary"
        )}>
          {getMotivationalMessage()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSummary;
