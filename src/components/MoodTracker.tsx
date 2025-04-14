
import React, { useState } from 'react';
import { useHabits } from '@/context/HabitContext';
import { MoodType } from '@/types/habit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown, Star, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface MoodButtonProps {
  mood: MoodType;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const MoodButton: React.FC<MoodButtonProps> = ({ mood, selected, onClick, icon, label }) => {
  const getMoodColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return 'text-yellow-500';
      case 'excited': return 'text-purple-500';
      case 'neutral': return 'text-gray-500';
      case 'sad': return 'text-blue-500';
      case 'stressed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <Button 
      variant={selected ? "default" : "outline"}
      size="lg"
      className={`flex flex-col items-center justify-center h-20 gap-1 ${selected ? 'bg-primary' : ''}`}
      onClick={onClick}
    >
      <div className={`${getMoodColor(mood)} ${selected ? 'text-primary-foreground' : ''}`}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </Button>
  );
};

const MoodTracker: React.FC = () => {
  const { addMoodEntry, getMoodForDate } = useHabits();
  const today = new Date();
  const currentMood = getMoodForDate(today);
  
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood?.mood || 'neutral');
  const [note, setNote] = useState<string>(currentMood?.note || '');
  
  const handleSubmit = () => {
    addMoodEntry(selectedMood, note);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          <MoodButton 
            mood="happy" 
            selected={selectedMood === 'happy'}
            onClick={() => setSelectedMood('happy')}
            icon={<Smile className="h-6 w-6" />}
            label="Happy"
          />
          <MoodButton 
            mood="excited" 
            selected={selectedMood === 'excited'}
            onClick={() => setSelectedMood('excited')}
            icon={<Star className="h-6 w-6" />}
            label="Excited"
          />
          <MoodButton 
            mood="neutral" 
            selected={selectedMood === 'neutral'}
            onClick={() => setSelectedMood('neutral')}
            icon={<Meh className="h-6 w-6" />}
            label="Neutral"
          />
          <MoodButton 
            mood="sad" 
            selected={selectedMood === 'sad'}
            onClick={() => setSelectedMood('sad')}
            icon={<Frown className="h-6 w-6" />}
            label="Sad"
          />
          <MoodButton 
            mood="stressed" 
            selected={selectedMood === 'stressed'}
            onClick={() => setSelectedMood('stressed')}
            icon={<AlertCircle className="h-6 w-6" />}
            label="Stressed"
          />
        </div>
        
        <div className="space-y-2 mt-4">
          <Label htmlFor="mood-note">Note (optional)</Label>
          <Textarea
            id="mood-note"
            placeholder="What's making you feel this way?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <Button 
          onClick={handleSubmit} 
          className="w-full mt-4"
        >
          Track My Mood
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
