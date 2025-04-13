
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '@/context/HabitContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import HabitCalendar from '@/components/HabitCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Calendar: React.FC = () => {
  const { habits, loading } = useHabits();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Habit Calendar</h1>
          <p className="text-muted-foreground">View your habit history and streaks</p>
        </div>
        
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
                <HabitCalendar habit={habit} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Calendar;
