import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundStars } from './BackgroundStars';

interface DiyaProps {
  index: number;
  top: string;
  left: string;
  isLit: boolean;
  onClick: () => void;
}

const messages = [
  "म्हारी दुआ है — थारे जीवन में कोई कमी कोनी आवे।",
  "थारी उमर लाम्बी हो अर थारो नाम रोशन हो।",
  "थारे जीवन में सोना जैसी चमक सदा बणी रहे।",
  "म्हारे दिल री दुआ है — थारो हर सपनो पूरो होवे।",
  "राजस्थान री माटी जैसो मजबूत अर सोने जैसो खरो रहे थूं।",
  "थारे आगे को रास्तो फूलां से भर्यो रहे सदा।",
  "थूं जित्थे भी जावे, थारो भाग थारे साथ चाले।",
  "जन्मदिन री खुशियाँ रिषभ अर समृद्धि!",
  "थारी मेहरबानी, बुध्दिमत्ता अर विनम्र हृदय नै सलाम।",
  "ए दिया रो उजालो थारा दिल में सदैव रहसी।",
  "थाने थारी जीन्दगी के हर एक पड़ाव पर सफलता, खुशी अने प्रेम मिले।",
  "आज रो दिन थारे नाम हो, आज री रात थारे नाम हो।"
];

// Refined coordinates explicitly positioned to drop perfectly into the base ledge of the 3-tiered arches
const archPositions = [
  // Top tier arches
  { top: '39.5%', left: '29%' }, { top: '47%', left: '38.5%' }, { top: '47%', left: '56%' }, { top: '39.5%', left: '65.5%' },
  // Mid tier arches
  { top: '55%', left: '29%' }, { top: '63%', left: '38%' }, { top: '63%', left: '56%' }, { top: '55%', left: '65.5%' },
  // Bottom tier arches
  { top: '72.5%', left: '28%' }, { top: '80%', left: '38%' }, { top: '80%', left: '56%' }, { top: '72.5%', left: '65.5%' },
];

const Diya: React.FC<DiyaProps> = ({ index, top, left, isLit, onClick }) => {
  return (
    <motion.div
      className="absolute cursor-pointer group flex flex-col items-center justify-end"
      // Using perfectly liquid scaling! 
      // Width is pinned to 5.5% of the stepwell width so the graphics scale perfectly identically as the window resizes.
      style={{ top, left, width: '5.5%', transform: 'translate(-50%, -85%)' }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      onClick={onClick}
    >
      <div className="relative w-full">
        {/* Diya Base */}
        <img 
          src="/assets/diya.png" 
          alt="Diya" 
          className={`w-full h-auto object-contain transition-all duration-500 origin-bottom ${isLit ? 'brightness-125 scale-110' : 'brightness-75 grayscale-[20%] scale-100'}`}
        />

        {/* Flame/Glow */}
        <AnimatePresence>
          {isLit && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute bottom-[80%] left-1/2 -translate-x-1/2 w-[25%]"
            >
              <motion.div 
                animate={{ 
                  scaleY: [1, 1.1, 1],
                  scaleX: [1, 1.05, 1],
                  y: [0, -2, 0]
                }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                className="relative w-full aspect-[1/1.5] origin-bottom flex justify-center items-end"
              >
                {/* Pure Glowing Core (No sharp borders or defined shapes) */}
                <div className="w-[80%] aspect-[1/1.5] bg-[#FFFFEE] rounded-[50%] opacity-100 shadow-[0_0_15px_#FFFACD]" style={{ filter: 'blur(2px)' }} />
              </motion.div>

              {/* Large Warm Outer Glow - Blur dynamically tied to viewport making halos resize precisely across devices */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700%] aspect-square bg-amber-500/40 rounded-full -z-10 pointer-events-none" 
                style={{ filter: 'blur(clamp(15px, 2.5vw, 40px))' }}
              />
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350%] aspect-square bg-yellow-400/50 rounded-full -z-10 pointer-events-none" 
                style={{ filter: 'blur(clamp(8px, 1.2vw, 20px))' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click Prompt (Hidden when lit) */}
        {!isLit && (
          <div className="absolute inset-x-0 -bottom-[35%] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-saffron-gold shadow-lg border border-saffron-gold/50 whitespace-nowrap">
              Light
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const DiyaSection: React.FC = () => {
  const [litDiyas, setLitDiyas] = useState<number[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleDiyaClick = (index: number) => {
    if (!litDiyas.includes(index)) {
      setLitDiyas([...litDiyas, index]);
    }
    setActiveMessage(messages[index]);
  };

  return (
    <section 
      className="relative min-h-screen w-full flex flex-col items-center pt-16 overflow-hidden bg-cover bg-center bg-[#070005]"
      style={{ backgroundImage: 'url("/assets/sky-background.png")' }}
    >
      <BackgroundStars count={60} />
      {/* Top Transition Mask (Softly melting from previous) */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-midnight-maroon via-midnight-maroon/30 via-midnight-maroon/10 to-transparent z-[5] pointer-events-none" />
      
      {/* Solid Lower Platform Extension */}
      <div className="absolute bottom-0 left-0 w-full h-[6.5vh] bg-[#41191A] z-0" />
      
      {/* Text Area (Sky) */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center z-[50] px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center relative z-[60]"
        >
          <h2 className="font-heading text-5xl md:text-7xl text-saffron-gold mb-4 uppercase tracking-[0.1em] font-bold drop-shadow-md">
            Circle of Light
          </h2>
          <p className="font-body text-ivory-text text-sm md:text-lg tracking-[0.1em] max-w-xl mx-auto italic font-medium drop-shadow-md">
            Every light you ignite carries a wish for your journey. Click the diyas to reveal their secrets.
          </p>
        </motion.div>

        {/* Glowing Wish Message Display */}
        <div className="mt-8 h-[160px] flex flex-col items-center w-full z-40 px-4">
          <AnimatePresence mode="wait">
            {activeMessage !== null && (
              <motion.div
                key={activeMessage}
                initial={{ opacity: 0, scale: 0.9, y: 15, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, y: -15, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center w-full max-w-4xl"
              >
                <motion.p 
                  animate={{ 
                    y: [-4, 4, -4],
                    textShadow: [
                      "0px 0px 10px rgba(255,255,255,0.7), 0px 0px 20px rgba(212,160,23,0.6), 0px 0px 40px rgba(212,160,23,0.4)",
                      "0px 0px 15px rgba(255,255,255,0.9), 0px 0px 30px rgba(212,160,23,0.8), 0px 0px 60px rgba(212,160,23,0.6)",
                      "0px 0px 10px rgba(255,255,255,0.7), 0px 0px 20px rgba(212,160,23,0.6), 0px 0px 40px rgba(212,160,23,0.4)"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="font-display text-2xl md:text-5xl text-[#FFFDF5] tracking-[0.1em] md:tracking-[0.15em] leading-tight md:leading-relaxed"
                >
                  {activeMessage}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stepwell Structure & Diyas Container */}
      <div className="relative w-full max-w-6xl mx-auto mt-auto flex-grow flex flex-col justify-end z-10">
        
        {/* The responsive locked aspect ratio image */}
        <img 
          src="/assets/stepwell.png" 
          alt="Stepwell Architecture"
          className="w-full h-auto block pointer-events-none"
        />

        {/* Diya coordinate map relative dynamically to the actual image pixels */}
        <div className="absolute inset-0">
          {archPositions.map((pos, i) => (
            <div key={i}>
              <Diya 
                index={i} 
                top={pos.top}
                left={pos.left}
                isLit={litDiyas.includes(i)}
                onClick={() => handleDiyaClick(i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
