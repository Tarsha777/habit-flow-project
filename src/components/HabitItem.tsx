
import React from 'react';
import { HabitType } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

interface HabitItemProps {
  habit: HabitType;
  onEdit: (habit: HabitType) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onEdit }) => {
  const { completeHabit, deleteHabit, isHabitCompletedToday } = useHabits();
  
  const isCompleted = isHabitCompletedToday(habit.id);
  
  const handleToggleComplete = () => {
    completeHabit(habit.id);
  };
  
  const getFrequencyBadge = () => {
    switch (habit.frequency) {
      case 'daily':
        return <Badge variant="outline" className="border-habit-primary text-habit-primary">Daily</Badge>;
      case 'weekly':
        return <Badge variant="outline" className="border-habit-secondary text-habit-secondary">Weekly</Badge>;
      case 'monthly':
        return <Badge variant="outline" className="border-habit-tertiary text-habit-tertiary">Monthly</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className={cn(
      "p-4 rounded-lg border flex items-center justify-between gap-3",
      "transition-all duration-300 hover:shadow-md",
      isCompleted && "border-habit-primary bg-habit-light/10"
    )}>
      {/* Checkbox */}
      <div
        className={cn(
          "habit-checkbox",
          isCompleted && "completed"
        )}
        onClick={handleToggleComplete}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      />
      
      {/* Habit details */}
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "font-medium text-lg transition-all",
            isCompleted && "text-habit-secondary"
          )}>
            {habit.name}
          </h3>
          {getFrequencyBadge()}
        </div>
        {habit.description && (
          <p className="text-muted-foreground text-sm mt-1">{habit.description}</p>
        )}
      </div>
      
      {/* Streak */}
      <div className="flex items-center gap-1 px-2 py-1 bg-accent rounded-full text-sm">
        <span>🔥</span>
        <span className="font-medium">{habit.streak}</span>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(habit)}>
          <Edit className="h-4 w-4" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete habit</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{habit.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteHabit(habit.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default HabitItem;
