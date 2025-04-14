
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import JournalEntry from '@/components/JournalEntry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenLine, Book, Calendar as CalendarIcon, Plus, ArrowLeft } from 'lucide-react';
import { format, subDays, startOfWeek, startOfMonth, isSameDay } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// Journal entry type
interface JournalEntryType {
  id: string;
  date: Date;
  content: string;
  type: 'daily' | 'weekly' | 'monthly';
}

const Journal: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily');
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCreating, setIsCreating] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  // Load journal entries from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        setEntries(parsedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  }, []);
  
  // Save entries to localStorage when they change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('journalEntries', JSON.stringify(entries));
    }
  }, [entries]);
  
  const handleSaveEntry = (content: string) => {
    if (!selectedDate) return;
    
    const newEntry: JournalEntryType = {
      id: Date.now().toString(),
      date: selectedDate,
      content,
      type: activeTab as 'daily' | 'weekly' | 'monthly'
    };
    
    // Check if an entry already exists for this date and type
    const existingEntryIndex = entries.findIndex(entry => 
      entry.type === activeTab && isSameDay(entry.date, selectedDate)
    );
    
    if (existingEntryIndex !== -1) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        content
      };
      setEntries(updatedEntries);
    } else {
      // Add new entry
      setEntries([...entries, newEntry]);
    }
    
    setIsCreating(false);
  };
  
  const getEntryForSelectedDate = () => {
    if (!selectedDate) return null;
    
    return entries.find(entry => 
      entry.type === activeTab && isSameDay(entry.date, selectedDate)
    );
  };
  
  const handleNewEntry = () => {
    setSelectedDate(new Date());
    setIsCreating(true);
  };
  
  const getDefaultDateByType = () => {
    switch (activeTab) {
      case 'weekly':
        return startOfWeek(new Date());
      case 'monthly':
        return startOfMonth(new Date());
      default:
        return new Date();
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedDate(getDefaultDateByType());
    setIsCreating(false);
  };
  
  // Get relevant entries for the current tab
  const getEntriesByType = () => {
    return entries.filter(entry => entry.type === activeTab)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };
  
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
        
        <Tabs defaultValue="daily" value={activeTab} onValueChange={handleTabChange}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={handleNewEntry}
              className="flex items-center gap-2 bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-90"
            >
              <PenLine className="w-4 h-4" />
              New Entry
            </Button>
          </div>
          
          <TabsContent value="daily">
            {isCreating ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsCreating(false)}
                    className="mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to entries
                  </Button>
                </div>
                <JournalEntry 
                  date={selectedDate || new Date()}
                  onSave={handleSaveEntry}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {getEntryForSelectedDate() ? (
                    <JournalEntry 
                      date={selectedDate || new Date()}
                      existingContent={getEntryForSelectedDate()?.content || ''}
                      onSave={handleSaveEntry}
                    />
                  ) : (
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
                        <Button 
                          onClick={handleNewEntry}
                          variant="default" 
                          className="w-full bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-95"
                        >
                          Write Today's Entry
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Entries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {getEntriesByType().length > 0 ? (
                        getEntriesByType().slice(0, 5).map((entry) => (
                          <div 
                            key={entry.id}
                            onClick={() => {
                              setSelectedDate(entry.date);
                              setIsCreating(false);
                            }}
                            className="p-3 rounded-md border cursor-pointer hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{format(entry.date, 'MMM d, yyyy')}</span>
                              <Book className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {entry.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-muted-foreground">
                          No entries yet. Start journaling to see them here.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="weekly">
            {isCreating ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsCreating(false)}
                    className="mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to entries
                  </Button>
                </div>
                <JournalEntry 
                  date={selectedDate || startOfWeek(new Date())}
                  onSave={handleSaveEntry}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {getEntryForSelectedDate() ? (
                    <JournalEntry 
                      date={selectedDate || startOfWeek(new Date())}
                      existingContent={getEntryForSelectedDate()?.content || ''}
                      onSave={handleSaveEntry}
                    />
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Book className="w-12 h-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Weekly Reflection</h3>
                          <p className="text-muted-foreground max-w-md mb-6">
                            Take time to reflect on your week's habits, accomplishments, and areas for improvement.
                          </p>
                          <Button 
                            onClick={handleNewEntry}
                            className="bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-90"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Create Weekly Journal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Weekly Entries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {getEntriesByType().length > 0 ? (
                        getEntriesByType().map((entry) => (
                          <div 
                            key={entry.id}
                            onClick={() => {
                              setSelectedDate(entry.date);
                              setIsCreating(false);
                            }}
                            className="p-3 rounded-md border cursor-pointer hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Week of {format(entry.date, 'MMM d, yyyy')}
                              </span>
                              <Book className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {entry.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-muted-foreground">
                          No weekly reflections yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monthly">
            {isCreating ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsCreating(false)}
                    className="mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to entries
                  </Button>
                </div>
                <JournalEntry 
                  date={selectedDate || startOfMonth(new Date())}
                  onSave={handleSaveEntry}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {getEntryForSelectedDate() ? (
                    <JournalEntry 
                      date={selectedDate || startOfMonth(new Date())}
                      existingContent={getEntryForSelectedDate()?.content || ''}
                      onSave={handleSaveEntry}
                    />
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Book className="w-12 h-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Monthly Review</h3>
                          <p className="text-muted-foreground max-w-md mb-6">
                            Review your habits, goals, and achievements for the month.
                          </p>
                          <Button 
                            onClick={handleNewEntry}
                            className="bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-90"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Create Monthly Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Entries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {getEntriesByType().length > 0 ? (
                        getEntriesByType().map((entry) => (
                          <div 
                            key={entry.id}
                            onClick={() => {
                              setSelectedDate(entry.date);
                              setIsCreating(false);
                            }}
                            className="p-3 rounded-md border cursor-pointer hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {format(entry.date, 'MMMM yyyy')}
                              </span>
                              <Book className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {entry.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-muted-foreground">
                          No monthly reviews yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Journal;
