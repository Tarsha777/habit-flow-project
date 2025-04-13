
import React, { useEffect, useState } from 'react';
import { Achievement } from '@/types/achievement';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAchievements } from '@/context/AchievementContext';

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

const AchievementPopup: React.FC = () => {
  const { recentlyUnlocked, dismissRecentAchievement } = useAchievements();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (recentlyUnlocked) {
      setIsVisible(true);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(dismissRecentAchievement, 300); // Wait for animation to complete
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [recentlyUnlocked, dismissRecentAchievement]);
  
  if (!recentlyUnlocked) return null;
  
  const { title, description, icon, color, category } = recentlyUnlocked;
  
  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg w-64 md:w-72 bg-white dark:bg-gray-900 border",
        "transform transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <DynamicIcon name={icon} size={24} color={color} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm">Achievement Unlocked!</h4>
              <p className="font-semibold">{title}</p>
            </div>
            <button 
              onClick={() => {
                setIsVisible(false);
                setTimeout(dismissRecentAchievement, 300);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Icons.X size={16} />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          <Badge 
            variant="outline" 
            className="mt-2 capitalize"
            style={{ color, borderColor: color }}
          >
            {category}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
