import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeditationStats {
  streak: number;
  totalMinutes: number;
  sessionsThisWeek: number;
  lastSessionDate?: Date;
}

const MeditationSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [stats, setStats] = useState<MeditationStats>({
    streak: 3,
    totalMinutes: 127,
    sessionsThisWeek: 4,
  });
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const durations = [5, 10, 15, 30];

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, timeLeft]);

  const handleSessionComplete = () => {
    setIsPlaying(false);
    setStats(prev => ({
      ...prev,
      totalMinutes: prev.totalMinutes + selectedDuration,
      sessionsThisWeek: prev.sessionsThisWeek + 1,
      lastSessionDate: new Date(),
    }));
    
    toast({
      title: "🧘‍♀️ Meditation Complete!",
      description: `You've completed a ${selectedDuration}-minute session. Your cosmic energy is aligned!`,
    });
  };

  const startMeditation = () => {
    setTimeLeft(selectedDuration * 60);
    setIsPlaying(true);
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft > 0 ? ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100 : 0;

  return (
    <Card className="cosmic-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-nebula to-cosmic-aurora flex items-center justify-center">
          🧘‍♀️
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-cosmic-constellation to-cosmic-moonlight bg-clip-text text-transparent">
          Cosmic Meditation
        </h2>
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="meditation-timer w-48 h-48 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--cosmic-deep))"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.827} ${282.7 - progress * 2.827}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--cosmic-constellation))" />
                  <stop offset="100%" stopColor="hsl(var(--cosmic-aurora))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center z-10">
              <div className="text-3xl font-mono text-cosmic-moonlight">
                {timeLeft > 0 ? formatTime(timeLeft) : `${selectedDuration}:00`}
              </div>
              <div className="text-sm text-cosmic-constellation mt-1">
                {isPlaying ? 'Meditating...' : 'Ready to begin'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Duration Selection */}
      <div className="flex justify-center gap-2 mb-6">
        {durations.map((duration) => (
          <Button
            key={duration}
            variant={selectedDuration === duration ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDuration(duration)}
            disabled={isPlaying}
            className="cosmic-button"
          >
            {duration}m
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        {!isPlaying && timeLeft === 0 ? (
          <Button onClick={startMeditation} className="cosmic-button gap-2">
            <Play className="w-4 h-4" />
            Start Session
          </Button>
        ) : (
          <>
            <Button onClick={togglePause} variant="outline" className="cosmic-button">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button onClick={resetTimer} variant="outline" className="cosmic-button">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="cosmic-card p-3">
          <div className="text-2xl font-bold text-cosmic-constellation">{stats.streak}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
        <div className="cosmic-card p-3">
          <div className="text-2xl font-bold text-cosmic-aurora">{stats.totalMinutes}</div>
          <div className="text-xs text-muted-foreground">Total Minutes</div>
        </div>
        <div className="cosmic-card p-3">
          <div className="text-2xl font-bold text-cosmic-moonlight">{stats.sessionsThisWeek}</div>
          <div className="text-xs text-muted-foreground">This Week</div>
        </div>
      </div>
    </Card>
  );
};

export default MeditationSection;