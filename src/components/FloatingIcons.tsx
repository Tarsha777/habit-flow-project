
import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

// Define icon categories for different sections of the app
const ICON_SETS = {
  general: ['Check', 'Star', 'Heart', 'Award', 'Trophy', 'ThumbsUp'],
  wellness: ['Yoga', 'Smile', 'Sun', 'Coffee', 'Moon'],
  productivity: ['CheckSquare', 'ClipboardCheck', 'Clock', 'Calendar', 'ListTodo'],
  fitness: ['Activity', 'Dumbbell', 'Flame', 'Zap', 'Timer'],
  learning: ['BookOpen', 'Lightbulb', 'GraduationCap', 'Brain'],
};

interface FloatingIcon {
  id: number;
  icon: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface FloatingIconsProps {
  iconSet?: keyof typeof ICON_SETS | (keyof typeof ICON_SETS)[];
  count?: number;
  className?: string;
}

const FloatingIcons: React.FC<FloatingIconsProps> = ({
  iconSet = 'general',
  count = 8,
  className,
}) => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  // Generate random icons on component mount
  useEffect(() => {
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      
      // Determine which icon sets to use
      let iconSets: string[] = [];
      if (Array.isArray(iconSet)) {
        iconSet.forEach(set => {
          iconSets = [...iconSets, ...ICON_SETS[set]];
        });
      } else {
        iconSets = ICON_SETS[iconSet];
      }
      
      // Generate random icons
      for (let i = 0; i < count; i++) {
        const randomIcon = iconSets[Math.floor(Math.random() * iconSets.length)];
        newIcons.push({
          id: i,
          icon: randomIcon,
          x: Math.random() * 100, // random position X (0-100%)
          y: Math.random() * 100, // random position Y (0-100%)
          size: Math.random() * 16 + 10, // random size between 10-26px
          opacity: Math.random() * 0.2 + 0.05, // random opacity between 0.05-0.25
          duration: Math.random() * 40 + 20, // random animation duration
          delay: Math.random() * -40, // random animation delay
        });
      }
      
      setIcons(newIcons);
    };
    
    generateIcons();
  }, [iconSet, count]);

  // Dynamic icon component
  const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
    // @ts-ignore - We know these icons exist in Lucide
    const IconComponent = Icons[name];
    
    if (!IconComponent) {
      return <Icons.Star {...props} />;
    }
    
    return <IconComponent {...props} />;
  };

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)}>
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            opacity: icon.opacity,
            animation: `float ${icon.duration}s infinite ease-in-out ${icon.delay}s`,
            zIndex: 0,
          }}
        >
          <DynamicIcon 
            name={icon.icon} 
            size={icon.size} 
            className="text-habit-primary"
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
