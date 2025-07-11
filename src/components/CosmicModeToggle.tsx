import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase, Heart } from 'lucide-react';

interface CosmicModeToggleProps {
  mode: 'work' | 'life';
  onModeChange: (mode: 'work' | 'life') => void;
}

const CosmicModeToggle: React.FC<CosmicModeToggleProps> = ({ mode, onModeChange }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    onModeChange(mode === 'work' ? 'life' : 'work');
  };

  return (
    <Card className="cosmic-card p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-cosmic-constellation to-cosmic-moonlight bg-clip-text text-transparent">
          Cosmic Mode
        </h3>
        <p className="text-sm text-muted-foreground">Toggle between your cosmic realms</p>
      </div>

      {/* Planetary System Toggle */}
      <div className="relative flex items-center justify-center h-24">
        <div className="relative w-64 h-16 bg-cosmic-deep rounded-full border border-cosmic-deep overflow-hidden">
          {/* Background gradient */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            mode === 'work' 
              ? 'bg-gradient-to-r from-blue-600/20 to-blue-400/20' 
              : 'bg-gradient-to-r from-pink-600/20 to-orange-400/20'
          }`} />

          {/* Moving planet */}
          <div 
            className={`absolute top-1 w-14 h-14 rounded-full transition-all duration-500 ${isAnimating ? 'animate-pulse' : ''} ${
              mode === 'work' 
                ? 'left-1 bg-gradient-to-r from-blue-500 to-blue-300' 
                : 'left-[calc(100%-60px)] bg-gradient-to-r from-pink-500 to-orange-300'
            }`}
            style={{
              boxShadow: mode === 'work' 
                ? '0 0 20px rgba(59, 130, 246, 0.5)' 
                : '0 0 20px rgba(236, 72, 153, 0.5)'
            }}
          >
            <button 
              onClick={handleToggle}
              className="w-full h-full rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              {mode === 'work' ? (
                <Briefcase className="w-6 h-6" />
              ) : (
                <Heart className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mode labels */}
          <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
            <div className={`text-sm font-medium transition-opacity ${
              mode === 'work' ? 'opacity-100 text-white' : 'opacity-40 text-muted-foreground'
            }`}>
              Work
            </div>
            <div className={`text-sm font-medium transition-opacity ${
              mode === 'life' ? 'opacity-100 text-white' : 'opacity-40 text-muted-foreground'
            }`}>
              Life
            </div>
          </div>
        </div>

        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-cosmic-stardust rounded-full ${isAnimating ? 'animate-pulse' : ''}`}
            style={{
              animation: `orbit ${3 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
              transform: `rotate(${i * 60}deg) translateX(80px) rotate(-${i * 60}deg)`
            }}
          />
        ))}
      </div>

      {/* Mode description */}
      <div className="text-center mt-4">
        <div className="text-sm text-cosmic-constellation">
          {mode === 'work' ? (
            <>
              <div className="font-medium">🌌 Work Cosmos</div>
              <div className="text-xs text-muted-foreground mt-1">
                Focus on productivity and professional growth
              </div>
            </>
          ) : (
            <>
              <div className="font-medium">🌟 Life Galaxy</div>
              <div className="text-xs text-muted-foreground mt-1">
                Embrace wellness, joy, and personal fulfillment
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CosmicModeToggle;