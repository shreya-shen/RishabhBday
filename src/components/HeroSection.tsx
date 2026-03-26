import React, { useState, useRef } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'motion/react';
import { BackgroundStars } from './BackgroundStars';

const FRIEND_NAME = "Rishabh & Samruddhi";
const BIRTHDAY_DATE = 'March 27, 2026';

interface HeroSectionProps {
  isEntered: boolean;
  setIsEntered: (value: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isEntered, setIsEntered }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  const palaceScale = useTransform(smoothProgress, [0, 0.9], [1, 95]);
  const palaceY = useTransform(smoothProgress, [0, 1], ['0%', '0%']);
  const skyScale = useTransform(smoothProgress, [0, 1], [1.02, 12]);
  const skyY = useTransform(smoothProgress, [0, 1], ['0%', '0%']);
  const blackoutOpacity = useTransform(smoothProgress, [0.65, 0.9], [0, 1]);

  return (
    <div className="relative w-full bg-midnight-maroon" ref={containerRef}>
      <section className={`relative ${isEntered ? 'h-[100vh]' : 'h-screen'} w-full bg-midnight-maroon transition-[height] duration-700`}>
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Background Sky */}
          <motion.img
            src="/assets/sky-background.png"
            alt="Night sky"
            className="absolute inset-0 z-[0] h-full w-full object-cover object-center pointer-events-auto"
            style={{ 
              filter: 'blur(0.7px)', 
              scale: isEntered ? skyScale : 1.02,
              y: skyY 
            }}
            animate={{ 
              scale: isEntered ? undefined : 1.02, 
              y: isEntered ? -20 : 0 
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          <BackgroundStars count={80} />

          {/* Interactive Envelope & Card */}
          <AnimatePresence mode="wait">
            {!isEntered && (
              <motion.div
                key="interactive-wrapper"
                className="absolute inset-0 flex items-center justify-center pointer-events-auto z-[500]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                transition={{ duration: 0.8 }}
              >
                <div 
                  className="relative w-[90vw] max-w-[500px] h-[450px]" 
                  style={{ 
                    perspective: '1200px',
                  }}
                >
                  
                  {/* The Invitation Card (Slides UP out of the envelope) */}
                  <motion.div
                    className="absolute bg-parchment-cream p-4 sm:p-6 text-center shadow-xl clip-jharokha flex flex-col justify-center"
                    style={{
                      left: '24px',
                      top: '20px',
                      border: '2px solid rgba(212,160,23,1)',
                      background: 'linear-gradient(rgba(255,252,240,1), rgba(255,252,240,1)), url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                      width: 'calc(100% - 48px)',
                      minHeight: '400px',
                      zIndex: isOpen ? 60 : 10
                    }}
                    initial={{ opacity: 0, scale: 0.8, y: 0, rotate: 0 }}
                    animate={{ 
                      y: isOpen ? [0, -420, 0] : 0,
                      scale: isOpen ? [0.8, 1.05, 1.02] : 0.8,
                      opacity: isOpen ? [0, 0.9, 1] : 0,
                      rotate: isOpen ? [0, -2, 0] : 0,
                      zIndex: isOpen ? 60 : 10
                    }}
                    transition={{ 
                      duration: 1.6, 
                      times: [0, 0.45, 1],
                      ease: "easeInOut",
                      delay: 0.7 
                    }}
                  >
                    <div className="relative z-[70] flex flex-col items-center mt-2">
                      <div className="mb-2">
                        <svg viewBox="0 0 100 40" width="60" height="24">
                          <path d="M5,40 L5,25 Q5,5 50,5 Q95,5 95,25 L95,40" fill="none" stroke="#D4A017" strokeWidth="1.5" />
                          <circle cx="50" cy="8" r="3" fill="#D4A017" />
                        </svg>
                      </div>

                      <p className="uppercase font-bold text-[#004D40] text-[13px] md:text-[15px] tracking-[0.2em]">Khamma Ghani!</p>
                      
                      <h1 className="mt-1 text-[#1A0A0E] font-display text-3xl md:text-4xl font-bold leading-tight">
                        {FRIEND_NAME}
                      </h1>
                      
                      <p className="mt-2 italic text-[#4A142C] text-sm md:text-base px-1 sm:px-4">They say the stars over Mehrangarh shine brighter on one night of the year. Tonight is that night. आओ, पधारो म्हारे देस!</p>
                      
                      <p className="mt-4 font-bold text-deep-burgundy tracking-widest uppercase text-sm md:text-base">Shaahi Jashan</p>
                      <p className="text-[#8B6914] text-[10px] md:text-[11px] font-bold mt-1 tracking-widest">{BIRTHDAY_DATE}</p>

                      <motion.button
                        onClick={() => {
                          setIsEntered(true);
                          window.dispatchEvent(new CustomEvent('palace-enter'));
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-5 mb-2 px-6 py-3 md:px-8 md:py-3 bg-saffron-gold text-midnight-maroon font-bold rounded-sm uppercase text-[10px] md:text-[11px] tracking-widest shadow-lg cursor-pointer"
                      >
                        Enter The Palace
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* The Envelope Body (Static lower flaps) */}
                  <div className="absolute inset-0 bg-[#3b1018] rounded-lg shadow-2xl overflow-hidden border border-[#5c1c28]">
                    {/* Left Flap */}
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-[#4a1520] z-20 border-r border-black/10 shadow-inner" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)', WebkitClipPath: 'polygon(0 0, 0 100%, 100% 50%)', background: 'linear-gradient(to right, #4a1520, #3b1018)', opacity: 1 }} />
                    {/* Right Flap */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[#4a1520] z-20 border-l border-black/10 shadow-inner" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)', WebkitClipPath: 'polygon(100% 0, 100% 100%, 0 50%)', background: 'linear-gradient(to left, #4a1520, #3b1018)', opacity: 1 }} />
                    {/* Bottom Flap */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#5c1c28] z-30 border-t border-white/5" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)', WebkitClipPath: 'polygon(0 100%, 100% 100%, 50% 0)', background: 'linear-gradient(to top, #5c1c28, #4a1520)', opacity: 1 }} />
                    
                    {/* Top Flap (Animated Opening) */}
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-[60%] bg-[#5c1c28] z-40 origin-top shadow-2xl border-b border-black/20"
                      style={{ 
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        WebkitClipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        background: 'linear-gradient(to bottom, #5c1c28, #4a1520)',
                        opacity: 1
                      }}
                      animate={{ 
                        rotateX: isOpen ? -160 : 0,
                        zIndex: isOpen ? 5 : 40 
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />

                    {/* Wax Seal & Instruction (Initial state) */}
                    <AnimatePresence>
                      {!isOpen && (
                        <motion.div 
                          className="absolute inset-0 flex flex-col items-center justify-center z-50 cursor-pointer"
                          onClick={() => setIsOpen(true)}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          {/* Wax Seal */}
                          <motion.div 
                            className=" mt-8 w-20 h-20 bg-[#6B1220] rounded-full flex items-center justify-center shadow-2xl border-2 border-saffron-gold/30"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="font-display text-2xl text-saffron-gold font-bold">SS</span>
                          </motion.div>
                          <motion.p 
                            className="mt-2 font-heading text-antique-gold text-lg uppercase tracking-[0.3em] font-extrabold drop-shadow-lg"
                            // animate={{ opacity: [0.4, 1, 0.4] }}
                            // transition={{ repeat: Infinity, duration: 2 }}
                          >
                            Click to Open
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Palace Reveal Frame (Appears on unroll) */}
          <motion.div
            className="absolute inset-0 z-[1] w-full h-full object-cover pointer-events-none"
            style={{ 
              backgroundImage: 'url("/assets/palace-silhouette.png")',
              backgroundSize: '50%', 
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center 95%', // Focused on steps
              transformOrigin: 'center 95%', // Zoom into the path
              scale: isEntered ? palaceScale : 1,
              y: palaceY,
              opacity: isEntered ? 1 : 0
            }}
          />

          {/* Blackout transition mask */}
          <motion.div
            className="absolute inset-0 z-[5] bg-midnight-maroon pointer-events-none"
            style={{ opacity: isEntered ? blackoutOpacity : 0 }}
          />

          {/* Seamless Bottom Blend */}
          <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-midnight-maroon to-transparent z-[10] pointer-events-none" />

          {/* Scroll Indicator after entry */}
          <AnimatePresence>
            {isEntered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ opacity: scrollIndicatorOpacity }}
                transition={{ delay: 1, duration: 1 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-[100]"
              >
                <p className="font-heading text-saffron-gold text-lg md:text-xl uppercase tracking-widest font-bold drop-shadow-lg text-center">
                  Scroll to enter your birthday palace!
                </p>
                <div className="text-saffron-gold animate-bounce">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
