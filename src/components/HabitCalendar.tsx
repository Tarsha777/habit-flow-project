
import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { HabitType } from '@/types/habit';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  isToday,
  isPast 
} from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarComponent,
  CalendarProps 
} from '@/components/ui/calendar';
import { CheckCheck, AlertTriangle, Calendar } from 'lucide-react';

interface HabitCalendarProps {
  habit: HabitType;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ 
  habit, 
  selectedDate,
  onSelectDate 
}) => {
  const { isHabitCompletedOnDate } = useHabits();
  
  // Calculate current streak and total completions
  const totalCompletions = habit.completedDates.length;
  
  // Get habit completion state for each day
  const getDayHabitState = (date: Date) => {
    const isCompleted = habit.completedDates.some(completedDate => 
      isSameDay(completedDate, date)
    );
    
    if (isCompleted) return "completed";
    if (isPast(date) && !isToday(date)) return "missed";
    if (isToday(date)) return "today";
    return "future";
  };
  
  // Custom day renderer for the calendar
  const renderDay = (day: Date, selectedDay: Date | undefined, dayProps: React.HTMLAttributes<HTMLDivElement>) => {
    const habitState = getDayHabitState(day);
    
    return (
      <div
        {...dayProps}
        className={cn(
          dayProps.className,
          "relative flex items-center justify-center",
          {
            "bg-status-completed/20 text-status-completed font-medium hover:bg-status-completed/30": 
              habitState === "completed",
            "border border-status-missed/30": 
              habitState === "missed",
            "bg-status-pending/10 text-status-pending font-medium hover:bg-status-pending/20": 
              habitState === "today",
            "hover:bg-accent/50": 
              habitState === "future"
          }
        )}
      >
        {format(day, "d")}
        {habitState === "completed" && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <div className="w-1 h-1 bg-status-completed rounded-full"></div>
          </div>
        )}
      </div>
    );
  };
  
  // Day modifier for the calendar
  const modifiers = {
    completed: (date: Date) => habit.completedDates.some(completedDate => 
      isSameDay(completedDate, date)
    ),
    missed: (date: Date) => 
      isPast(date) && 
      !isToday(date) && 
      !habit.completedDates.some(completedDate => isSameDay(completedDate, date)),
    today: (date: Date) => isToday(date),
  };
  
  const modifiersClassNames = {
    completed: "bg-status-completed/20 text-status-completed font-medium hover:bg-status-completed/30",
    missed: "border border-status-missed/30",
    today: "bg-status-pending/10 text-status-pending font-medium hover:bg-status-pending/20",
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{habit.name} Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal">
              Streak: {habit.streak}
            </Badge>
            <Badge variant="outline" className="font-normal">
              Total: {totalCompletions}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarComponent 
          mode="single"
          selected={selectedDate || undefined}
          onSelect={(date) => date && onSelectDate(date)}
          className="rounded-md border"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
        
        <div className="flex justify-center mt-4 text-xs gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-status-completed" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-status-missed" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-status-pending" />
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCalendar;
