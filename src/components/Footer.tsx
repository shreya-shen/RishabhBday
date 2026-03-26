import React from 'react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full py-12 bg-midnight-maroon flex flex-col items-center justify-center overflow-hidden">
      {/* Top Transition Mask (Seamless hand-off from LanternLaunch) */}
      {/* <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#070005] to-transparent z-10 pointer-events-none" /> */}
      
      {/* Background Textures */}
      <div className="absolute inset-0 bg-bandhani opacity-5 pointer-events-none"></div>
      
      <div className="relative z-20 flex flex-col items-center gap-4">
        {/* Decorative Divider */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-saffron-gold"></div>
          <div className="w-2 h-2 rotate-45 border border-saffron-gold"></div>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-saffron-gold"></div>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-body text-ivory-text/80 text-lg md:text-xl tracking-widest uppercase font-medium"
        >
          Made with <span className="text-rani-pink inline-block animate-pulse mx-1">❤️</span> by <span className="text-saffron-gold font-bold">Shreya</span>
        </motion.p>

        {/* <p className="font-body text-ivory-text/40 text-xs uppercase tracking-[0.3em] mt-2">
          Shaahi Jashan 2026
        </p> */}
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-saffron-gold/30 to-transparent"></div>
    </footer>
  );
};
