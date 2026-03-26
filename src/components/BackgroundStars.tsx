import React, { useRef } from 'react';

export const BackgroundStars = ({ count = 60 }: { count?: number }) => {
  const stars = useRef(Array.from({ length: count }).map(() => ({
    id: Math.random(),
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 10,
  }))).current;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden mix-blend-screen bg-transparent">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse opacity-40 shadow-[0_0_5px_rgba(255,255,255,0.8)]"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};