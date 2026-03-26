import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Stars = () => {
    const stars = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 1.5 + 1,
        delay: Math.random() * 5,
    }));

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute bg-white rounded-full animate-pulse opacity-40 shadow-[0_0_4px_#fff]"
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

export const LanternLaunch: React.FC = () => {
  const [isLaunched, setIsLaunched] = useState(false);
  const [wishText, setWishText] = useState("");

  const handleLaunch = () => {
    if (wishText.trim()) {
      setIsLaunched(true);
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] bg-[#070005] flex flex-col items-center overflow-hidden">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-gradient-to-t from-[#2a0815]/80 via-[#2a0815]/30 to-transparent"></div>
         <Stars />
      </div>

      {/* Header overlay */}
      <div className="z-20 text-center mt-12 relative pointer-events-none">
        <h2 className="font-heading text-4xl md:text-5xl text-saffron-gold mb-4 font-bold tracking-widest drop-shadow-md">Launch a Wish</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-saffron-gold to-transparent mx-auto rounded-full mb-4"></div>
        <p className="font-body text-ivory-text/80 max-w-xl mx-auto px-4 font-medium italic">
          Release your wish into the cosmic night. Let the royal lantern carry your heart's desire!
        </p>
      </div>

      {/* 
         GPU-ACCELERATED CSS-3D LANTERN 
         This implementation bypasses WebGL (which is currently disabled in your browser) 
         but uses High-Fidelity CSS 3D Transforms and Perspective to simulate the same 3D experience.
      */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none [perspective:1000px]">
        <AnimatePresence>
          <motion.div
            key="css-3d-lantern"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={isLaunched ? {
              y: -1200,
              x: [0, 40, -40, 20, 0],
              opacity: [1, 1, 0.8, 0],
              scale: [1, 0.7, 0.4, 0.2]
            } : {
              opacity: 1,
              scale: 1,
              y: [0, -20, 0],
              rotateY: [0, 15, -15, 0],
              rotateX: [0, 10, -10, 0]
            }}
            transition={isLaunched ? {
              y: { duration: 10, ease: "easeIn" },
              x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 10, ease: "easeIn" },
              opacity: { duration: 10, times: [0, 0.8, 0.9, 1] }
            } : {
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1 }
            }}
            className="relative w-48 h-64 md:w-64 md:h-80 [transform-style:preserve-3d]"
          >
            {/* The Royal Lantern Graphics (High Res Sprite) */}
            <div className="relative w-full h-full [transform:translateZ(50px)]">
               <img 
                 src="/assets/lantern.png" 
                 alt="Royal Lantern" 
                 className="w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(212,160,23,0.9)]"
               />
               {/* Internal Glow simulation */}
               <motion.div 
                 animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                 transition={{ repeat: Infinity, duration: 3 }}
                 className="absolute inset-0 bg-saffron-gold/30 rounded-full blur-[60px] -z-10"
               />
            </div>

            {/* Light casting effect on the 'atmosphere' */}
            <motion.div 
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400%] aspect-square bg-saffron-gold/10 rounded-full blur-[120px] -z-20"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Launch Controls Overlay */}
      <AnimatePresence>
        {!isLaunched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-6 flex flex-col items-center gap-4"
          >
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Write your wish here..."
              className="w-full bg-black/60 backdrop-blur-md text-ivory-text placeholder:text-ivory-text/60 border-2 border-saffron-gold rounded-xl p-4 text-center font-body resize-none pointer-events-auto shadow-2xl"
              rows={2}
              maxLength={120}
            />
            <button
              onClick={handleLaunch}
              disabled={!wishText.trim()}
              className="px-10 py-3 rounded-full bg-saffron-gold text-midnight-maroon font-bold text-lg uppercase tracking-widest shadow-lg hover:bg-ivory-text transition-all transform hover:scale-105 pointer-events-auto border-2 border-saffron-gold/50"
            >
              Release Lantern
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Celebration Message */}
      <AnimatePresence>
        {isLaunched && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.5, duration: 1, type: 'spring' }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-md px-8 md:px-12 py-10 rounded-3xl border-2 border-saffron-gold text-center shadow-2xl w-11/12 max-w-lg"
          >
            <h3 className="font-heading text-2xl md:text-3xl text-saffron-gold drop-shadow-sm mb-6 font-bold uppercase tracking-wider">Your wish is soaring</h3>
            <p className="font-body text-ivory-text text-xl md:text-2xl font-medium leading-relaxed italic px-4">
              "{wishText}"
            </p>
            <p className="font-body text-saffron-gold/80 text-sm font-medium uppercase tracking-widest mt-8">
              May the stars guide it true.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
