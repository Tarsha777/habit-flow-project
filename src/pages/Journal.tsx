
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenLine, Book, Calendar as CalendarIcon } from 'lucide-react';

const Journal: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
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
          <h1 className="text-3xl font-bold">Journal</h1>
          <p className="text-muted-foreground">
            Record your thoughts, reflections and track your progress
          </p>
        </div>
        
        <Tabs defaultValue="daily">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <Button className="flex items-center gap-2">
              <PenLine className="w-4 h-4" />
              New Entry
            </Button>
          </div>
          
          <TabsContent value="daily">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-habit-primary/10 to-habit-tertiary/5 border-habit-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Today's Journal</CardTitle>
                    <CalendarIcon className="w-4 h-4 text-habit-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    You haven't written a journal entry for today.
                  </p>
                  <Button variant="playful" showSparkle className="w-full">
                    Write Today's Entry
                  </Button>
                </CardContent>
              </Card>
              
              {/* Placeholder for future journal entries */}
              <Card className="opacity-70 hover:opacity-100 transition-opacity">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Yesterday</CardTitle>
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="line-clamp-4 text-sm">
                    Coming soon: Your journal entries will appear here.
                  </p>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" disabled>View</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Book className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Weekly Journal Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    Soon you'll be able to write weekly reflections and see insights about your habits.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monthly">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Book className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Monthly Journal Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    Soon you'll be able to write monthly reflections and see detailed habit statistics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Journal;
