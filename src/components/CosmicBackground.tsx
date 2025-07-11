import React, { useEffect, useRef } from 'react';

const CosmicBackground: React.FC = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createStars = () => {
      if (!starsRef.current) return;

      const starsContainer = starsRef.current;
      starsContainer.innerHTML = '';

      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 2}s`;
        starsContainer.appendChild(star);
      }
    };

    createStars();
  }, []);

  return (
    <div className="stars" ref={starsRef} />
  );
};

export default CosmicBackground;