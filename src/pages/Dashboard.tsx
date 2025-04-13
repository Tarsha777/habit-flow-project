import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '@/context/HabitContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import HabitItem from '@/components/HabitItem';
import HabitForm from '@/components/HabitForm';
import ProgressSummary from '@/components/ProgressSummary';
import HabitRecommendations from '@/components/HabitRecommendations';
import { HabitType } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { habits, loading, addHabit, getRecommendations } = useHabits();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitType | null>(null);
  
  // Get AI-powered habit recommendations
  const recommendations = getRecommendations();
  
  // Handle recommendation selection
  const handleAddRecommendation = (rec: any) => {
    addHabit(
      rec.name,
      rec.description,
      rec.frequency,
      rec.color,
      rec.icon
    );
  };
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  const handleAddHabit = () => {
    setEditingHabit(null);
    setIsHabitFormOpen(true);
  };
  
  const handleEditHabit = (habit: HabitType) => {
    setEditingHabit(habit);
    setIsHabitFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsHabitFormOpen(false);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Habits</h1>
            <p className="text-muted-foreground">Track your progress and build better habits</p>
          </div>
          
          <Button onClick={handleAddHabit} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add New Habit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <ProgressSummary />
          </div>
          <div className="bg-accent/50 rounded-lg p-4 flex flex-col justify-center items-center">
            <h2 className="text-lg font-medium mb-2">Quick Tips</h2>
            <ul className="text-sm space-y-2">
              <li>• Start small with achievable habits</li>
              <li>• Be consistent and track daily</li>
              <li>• Celebrate your streaks</li>
              <li>• Focus on building one habit at a time</li>
            </ul>
          </div>
        </div>
        
        {/* Show recommendations if no habits or if there are quality recommendations */}
        {(habits.length === 0 || recommendations.length > 0) && (
          <HabitRecommendations
            recommendations={recommendations}
            onAddHabit={handleAddRecommendation}
          />
        )}
        
        {habits.length === 0 ? (
          <div className="bg-background border-2 border-dashed border-border rounded-lg py-12 px-6 text-center">
            <h2 className="text-xl font-medium mb-2">No habits added yet</h2>
            <p className="text-muted-foreground mb-4">
              Start by adding your first habit to track.
            </p>
            <Button onClick={handleAddHabit} variant="outline" className="mx-auto flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Your First Habit
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onEdit={handleEditHabit}
              />
            ))}
          </div>
        )}
      </div>
      
      <HabitForm
        open={isHabitFormOpen}
        onClose={handleCloseForm}
        editingHabit={editingHabit}
      />
    </div>
  );
};

export default Dashboard;
