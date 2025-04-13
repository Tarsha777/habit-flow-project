
import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { HabitType } from '@/types/habit';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface HabitCalendarProps {
  habit: HabitType;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habit }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  
  const getDayStatus = (day: Date) => {
    // Check if the habit was completed on this day
    const isCompleted = habit.completedDates.some(date => isSameDay(date, day));
    
    // Today or past day
    const isToday = isSameDay(day, new Date());
    const isPast = day < new Date() && !isToday;
    
    if (isCompleted) return "completed";
    if (isPast) return "missed";
    if (isToday) return "pending";
    return "";
  };
  
  const previousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  const nextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={previousMonth}
            className="text-sm p-1 hover:bg-accent rounded-md"
          >
            &lt; Prev
          </button>
          <h3 className="font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
          <button 
            onClick={nextMonth}
            className="text-sm p-1 hover:bg-accent rounded-md"
          >
            Next &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-xs font-medium py-1">
              {day}
            </div>
          ))}
          
          {/* Generate empty cells for days before the start of the month */}
          {Array.from({ length: startDate.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}
          
          {/* Calendar days */}
          {daysInMonth.map((day) => {
            const status = getDayStatus(day);
            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "calendar-day",
                  status
                )}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
        
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
