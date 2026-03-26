import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const PuppetLayer: React.FC<{ isGameActive?: boolean }> = ({ isGameActive }) => {
  // Puppet entrance and presence
  const targetY = useMotionValue(-800);
  const smoothY = useSpring(targetY, { stiffness: 50, damping: 22 });

  useEffect(() => {
    // Initial drop on load
    const timer = setTimeout(() => {
      if (!isGameActive) targetY.set(0);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll-based pull up/drop down
    if (isGameActive) {
      targetY.set(-800);
    } else {
      targetY.set(0);
    }
  }, [isGameActive, targetY]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Maharaja Puppet (Left) */}
      <motion.div 
        className="absolute left-[2%] sm:left-[5%] top-[35vh] flex flex-col items-center"
        style={{ y: smoothY }}
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            x: [-5, 5, -5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4.5, 
            ease: "easeInOut" 
          }}
          className="relative flex flex-col items-center"
        >
          {/* String/Thread - Aligned for perfect symmetry */}
          <div className="w-[2px] h-[150vh] bg-white/60 absolute bottom-[52%] left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          
          <motion.div
            animate={{ 
              rotate: [-6, 6, -6],
              scaleY: [1, 1.04, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4.5, 
              ease: "easeInOut" 
            }}
            className="w-32 sm:w-48 md:w-60 h-auto origin-top"
          >
            <img 
              src="/assets/kathputli-maharaja.png" 
              alt="Kathputli Maharaja" 
              className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Maharani Puppet (Right) */}
      <motion.div 
        className="absolute right-[2%] sm:right-[5%] top-[35vh] flex flex-col items-center"
        style={{ y: smoothY }}
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            x: [5, -5, 5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4.5, 
            ease: "easeInOut" 
          }}
          className="relative flex flex-col items-center"
        >
          {/* String/Thread - Lowered significantly to reach the head through transparent padding */}
          <div className="w-[2px] h-[150vh] bg-white/60 absolute bottom-[52%] left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          
          <motion.div
            animate={{ 
              rotate: [6, -6, 6],
              scaleY: [1, 1.04, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4.5, 
              ease: "easeInOut" 
            }}
            className="w-32 sm:w-48 md:w-60 h-auto origin-top"
          >
            <img 
              src="/assets/kathputli-maharani.png" 
              alt="Kathputli Maharani" 
              className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
