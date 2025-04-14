
import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays } from 'date-fns';
import { MoodType } from '@/types/habit';
import { Smile, Meh, Frown, Star, AlertCircle } from 'lucide-react';

const MoodTrends: React.FC = () => {
  const { getMoodTrend } = useHabits();
  const recentMoods = getMoodTrend(7);
  
  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return <Smile className="h-5 w-5 text-yellow-500" />;
      case 'excited': return <Star className="h-5 w-5 text-purple-500" />;
      case 'neutral': return <Meh className="h-5 w-5 text-gray-500" />;
      case 'sad': return <Frown className="h-5 w-5 text-blue-500" />;
      case 'stressed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Meh className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getMoodColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return 'bg-yellow-100 text-yellow-800';
      case 'excited': return 'bg-purple-100 text-purple-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'sad': return 'bg-blue-100 text-blue-800';
      case 'stressed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Generate dates for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const mood = recentMoods.find(m => format(m.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    
    return {
      date,
      mood: mood?.mood || null
    };
  }).reverse();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {last7Days.map((day, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
            >
              <span className="text-sm font-medium">
                {format(day.date, 'E, MMM d')}
              </span>
              {day.mood ? (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getMoodColor(day.mood)}`}>
                  {getMoodIcon(day.mood)}
                  <span className="text-xs capitalize">{day.mood}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">No mood tracked</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrends;
