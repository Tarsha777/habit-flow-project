import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  energy: number;
  timestamp: Date;
}

const moods = [
  { emoji: '😊', label: 'Joyful', energy: 5, color: 'cosmic-moonlight' },
  { emoji: '😌', label: 'Peaceful', energy: 4, color: 'cosmic-constellation' },
  { emoji: '😐', label: 'Neutral', energy: 3, color: 'cosmic-stardust' },
  { emoji: '😔', label: 'Low', energy: 2, color: 'cosmic-nebula' },
  { emoji: '😢', label: 'Sad', energy: 1, color: 'cosmic-aurora' },
];

const CosmicMoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [cosmicEnergy, setCosmicEnergy] = useState(0);
  const [showMoodOrb, setShowMoodOrb] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate cosmic energy from mood entries
    const totalEnergy = moodEntries.reduce((sum, entry) => sum + entry.energy, 0);
    setCosmicEnergy(totalEnergy);
  }, [moodEntries]);

  const submitMood = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood.label,
      emoji: selectedMood.emoji,
      energy: selectedMood.energy,
      timestamp: new Date(),
    };

    setMoodEntries(prev => [newEntry, ...prev.slice(0, 6)]); // Keep last 7 entries
    setShowMoodOrb(true);

    toast({
      title: "🌌 Mood Captured!",
      description: `Your ${selectedMood.label} energy has been added to the Mood Galaxy!`,
    });

    setTimeout(() => setShowMoodOrb(false), 2000);
    setSelectedMood(null);
  };

  const getGalaxyFill = () => {
    return Math.min((cosmicEnergy / 35) * 100, 100); // Max energy = 35 (7 days * 5 max energy)
  };

  return (
    <Card className="cosmic-card p-6 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-aurora to-cosmic-nebula flex items-center justify-center">
          🌌
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-cosmic-constellation to-cosmic-moonlight bg-clip-text text-transparent">
          Galactic Mood Ring
        </h2>
      </div>

      {/* Mood Galaxy Visualization */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-2 border-cosmic-deep bg-gradient-to-r from-cosmic-void to-cosmic-deep">
            <div 
              className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-cosmic-nebula to-cosmic-aurora transition-all duration-1000"
              style={{ height: `${getGalaxyFill()}%` }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-cosmic-moonlight">{cosmicEnergy}</div>
              <div className="text-xs text-cosmic-constellation">Cosmic Energy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Selection */}
      <div className="text-center mb-6">
        <p className="text-cosmic-constellation mb-4">How are you feeling in the cosmos today?</p>
        <div className="flex justify-center gap-3 flex-wrap">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              className={`mood-orb w-16 h-16 flex flex-col items-center justify-center text-xs transition-all ${
                selectedMood?.label === mood.label 
                  ? 'ring-2 ring-cosmic-constellation scale-110' 
                  : ''
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs text-cosmic-moonlight">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      {selectedMood && (
        <div className="text-center mb-6">
          <Button onClick={submitMood} className="cosmic-button">
            Send to Mood Galaxy ✨
          </Button>
        </div>
      )}

      {/* Flying Mood Orb Animation */}
      {showMoodOrb && selectedMood && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <div className="mood-orb w-12 h-12 flex items-center justify-center animate-pulse">
            <span className="text-2xl">{selectedMood.emoji}</span>
          </div>
        </div>
      )}

      {/* Recent Mood History */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => {
          const entry = moodEntries[i];
          return (
            <div key={i} className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                entry 
                  ? 'bg-gradient-to-r from-cosmic-stardust to-cosmic-constellation' 
                  : 'bg-cosmic-deep border border-cosmic-deep'
              }`}>
                {entry ? entry.emoji : '○'}
              </div>
              <div className="text-xs text-cosmic-constellation mt-1">
                {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'short' })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CosmicMoodTracker;