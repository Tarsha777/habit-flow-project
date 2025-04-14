import React from 'react';
import { HabitType } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend 
} from 'recharts';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  isWithinInterval,
  subDays,
  startOfMonth,
  endOfMonth
} from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from '@/components/ui/chart';

interface HabitStatisticsProps {
  habits: HabitType[];
  selectedDate: Date | null;
}

const HabitStatistics: React.FC<HabitStatisticsProps> = ({ habits, selectedDate }) => {
  const { isHabitCompletedOnDate } = useHabits();
  
  // Get habits completed on selected date
  const habitsCompletedOnDate = selectedDate 
    ? habits.filter(habit => isHabitCompletedOnDate(habit.id, selectedDate))
    : [];
  
  // Get weekly data
  const getWeeklyData = () => {
    const today = new Date();
    const startDay = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
    const endDay = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDay, end: endDay });
    
    return days.map(day => {
      const completed = habits.filter(habit => 
        habit.completedDates.some(date => isSameDay(date, day))
      ).length;
      
      return {
        name: format(day, 'EEE'),
        completed,
        date: format(day, 'MMM d')
      };
    });
  };
  
  // Get habit type distribution
  const getHabitDistribution = () => {
    const frequencyGroups = habits.reduce((acc, habit) => {
      const frequency = habit.frequency;
      if (!acc[frequency]) {
        acc[frequency] = 0;
      }
      acc[frequency]++;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(frequencyGroups).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };
  
  // Get streak data for the last 30 days
  const getStreakData = () => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
    
    // Count how many habits were completed each day
    return days.map(day => {
      const completedCount = habits.filter(habit => 
        habit.completedDates.some(date => isSameDay(date, day))
      ).length;
      
      return {
        date: format(day, 'MMM d'),
        completed: completedCount,
      };
    });
  };
  
  const weeklyData = getWeeklyData();
  const distributionData = getHabitDistribution();
  const streakData = getStreakData();

  // Colors for charts
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#10B981', '#F59E0B', '#EF4444'];
  
  // Custom tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow-sm">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-xs text-primary">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {selectedDate ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {habitsCompletedOnDate.length > 0 ? (
              <div>
                <p className="font-medium mb-2">Completed Habits:</p>
                <ul className="space-y-2">
                  {habitsCompletedOnDate.map(habit => (
                    <li key={habit.id} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-status-completed"></span>
                      {habit.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-center">
                  <div className="text-4xl font-bold text-status-completed mb-2">
                    {habitsCompletedOnDate.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {habitsCompletedOnDate.length === 1 ? 'Win' : 'Wins'} on this day
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No habits completed on this day</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                config={{ 
                  completed: { 
                    theme: { 
                      light: '#9b87f5', 
                      dark: '#9b87f5' 
                    }, 
                    label: 'Completed' 
                  } 
                }}
                className="h-[200px]"
              >
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Habit Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">30 Day Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                config={{ 
                  completed: { 
                    theme: { 
                      light: '#9b87f5', 
                      dark: '#9b87f5' 
                    }, 
                    label: 'Completed Habits' 
                  } 
                }}
                className="h-[200px]"
              >
                <LineChart data={streakData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="var(--color-completed)" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default HabitStatistics;
