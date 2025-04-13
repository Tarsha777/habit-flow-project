
import React from 'react';
import { Achievement } from '@/types/achievement';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';

interface DynamicIconProps {
  name: string;
  className?: string;
  [key: string]: any;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  // @ts-ignore - Icons come from lucide-react
  const IconComponent = Icons[name.charAt(0).toUpperCase() + name.slice(1)];
  
  if (!IconComponent) {
    return <Icons.Award {...props} />;
  }
  
  return <IconComponent {...props} />;
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'md',
  showTooltip = true
}) => {
  const { title, description, icon, color, unlockedAt, progress = 0 } = achievement;
  const isUnlocked = !!unlockedAt;
  
  const badgeContent = (
    <div 
      className={cn(
        "flex flex-col items-center justify-center rounded-full transition-all duration-300",
        isUnlocked 
          ? "filter-none opacity-100" 
          : "filter grayscale opacity-60",
        {
          'w-8 h-8': size === 'sm',
          'w-12 h-12': size === 'md',
          'w-16 h-16': size === 'lg',
        }
      )}
      style={{ 
        backgroundColor: isUnlocked ? `${color}20` : '#e5e5e5',
        border: `2px solid ${isUnlocked ? color : '#a0a0a0'}`
      }}
    >
      <DynamicIcon 
        name={icon} 
        className={cn(
          "transition-all",
          {
            'h-4 w-4': size === 'sm',
            'h-6 w-6': size === 'md',
            'h-8 w-8': size === 'lg',
          }
        )}
        color={isUnlocked ? color : '#a0a0a0'}
      />
    </div>
  );
  
  if (!showTooltip) {
    return badgeContent;
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {badgeContent}
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <DynamicIcon 
              name={icon} 
              className="h-5 w-5 mt-0.5"
              color={isUnlocked ? color : '#a0a0a0'} 
            />
            <div>
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          {!isUnlocked && (
            <div className="mt-1">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <Progress value={progress * 100} className="h-1.5" />
            </div>
          )}
          
          {isUnlocked && (
            <p className="text-xs text-muted-foreground mt-1">
              Unlocked {unlockedAt?.toLocaleDateString()}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AchievementBadge;
