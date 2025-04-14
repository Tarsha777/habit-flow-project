
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '@/context/HabitContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import HabitCalendar from '@/components/HabitCalendar';
import HabitStatistics from '@/components/HabitStatistics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { PlayfulButton } from '@/components/ui/playful-button';
import { Calendar as CalendarIcon } from 'lucide-react';

const Calendar: React.FC = () => {
  const { habits, loading } = useHabits();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const clearSelectedDate = () => {
    setSelectedDate(null);
  };
  
  if (isLoading || loading) {
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
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Habit Calendar</h1>
            <p className="text-muted-foreground">View your habit history and track your progress</p>
          </div>
          
          {selectedDate && (
            <div className="flex items-center gap-2">
              <div className="bg-accent/30 rounded-md px-3 py-1 text-sm">
                <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                Viewing: {format(selectedDate, 'MMMM d, yyyy')}
              </div>
              <PlayfulButton 
                variant="outline" 
                size="sm"
                onClick={clearSelectedDate}
              >
                Show All
              </PlayfulButton>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {habits.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No habits to display</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8">
                    You haven't created any habits yet. Go to the dashboard to add habits.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue={habits[0]?.id}>
                <TabsList className="mb-4 overflow-x-auto flex whitespace-nowrap max-w-full pb-1">
                  {habits.map((habit) => (
                    <TabsTrigger key={habit.id} value={habit.id}>
                      {habit.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {habits.map((habit) => (
                  <TabsContent key={habit.id} value={habit.id}>
                    <HabitCalendar 
                      habit={habit} 
                      selectedDate={selectedDate}
                      onSelectDate={handleDateSelect}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
          
          <div>
            <HabitStatistics habits={habits} selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
