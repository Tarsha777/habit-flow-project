
import React from 'react';
import { PlusCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useHabits } from '@/context/HabitContext';
import { HabitRecommendation } from '@/utils/recommendationEngine';
import { cn } from '@/lib/utils';

interface HabitRecommendationProps {
  recommendations: HabitRecommendation[];
  onAddHabit: (rec: HabitRecommendation) => void;
}

const HabitRecommendations: React.FC<HabitRecommendationProps> = ({ 
  recommendations,
  onAddHabit
}) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-medium">Recommended for you</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map((rec, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div 
                className={cn(
                  "group relative border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer",
                  "bg-gradient-to-br from-white to-accent/20 dark:from-background dark:to-accent/10"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{rec.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {rec.description}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  className="absolute right-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddHabit(rec);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4">
              <div className="space-y-2">
                <h3 className="font-medium">{rec.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {rec.description}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span 
                    className="px-2 py-1 rounded-full" 
                    style={{ backgroundColor: rec.color ? `${rec.color}20` : undefined, color: rec.color }}
                  >
                    {rec.category}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-accent/50 text-accent-foreground">
                    {rec.frequency}
                  </span>
                </div>
                <Button 
                  className="w-full mt-2"
                  onClick={() => onAddHabit(rec)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add this habit
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

export default HabitRecommendations;
