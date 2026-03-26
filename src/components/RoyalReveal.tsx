import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from 'motion/react';
import confetti from 'canvas-confetti';
import { BackgroundStars } from './BackgroundStars';

export const RoyalReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 95%', 'end end'],
  });

  const latchedProgress = useMotionValue(0);
  const smoothProgress = useSpring(latchedProgress, { stiffness: 400, damping: 90 });

  // Background fades immediately
  const bgMaroonOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

  // Unroll mapping - completes by 95% scroll
  const unrollProgress = useTransform(smoothProgress, [0, 0.95], [0, 1]);

  // Use clipPath for clean unfurling - slightly overshooting to ensure full reveal
  const clipPath = useTransform(unrollProgress, [0, 1], ["inset(0% 0% 100% 0%)", "inset(0% 0% -5% 0%)"]);

  // Fade in the parchment container itself
  const parchmentOpacity = useTransform(unrollProgress, [0, 0.05], [0, 1]);

  // Text content fades in and slides slightly earlier
  const innerContentOpacity = useTransform(unrollProgress, [0.1, 0.8], [0, 1]);
  const innerContentY = useTransform(unrollProgress, [0.1, 0.8], [20, 0]);



  const triggerFireworks = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#D4A017', '#C8A96A', '#FDF5E6', '#FFD700'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#D4A017', '#C8A96A', '#FDF5E6', '#FFD700'],
      });
    }, 250);
  };

  const CountdownDisplay = () => {
    const [displayTime, setDisplayTime] = useState({ h: 12, m: 45, s: 23 });
    const targetDate = 26;

    // Use a single numeric motion value for the total remaining seconds
    const totalSeconds = useMotionValue(45923); 

    return (
      <motion.div 
        onViewportEnter={() => {
          const now = new Date();
          const midnight = new Date(now.getFullYear(), now.getMonth(), targetDate, 23, 59, 59);
          
          if (now < midnight) {
            const timer = setInterval(() => {
              const current = new Date();
              const diff = Math.max(0, midnight.getTime() - current.getTime());
              const s = Math.floor(diff / 1000);
              totalSeconds.set(s);
              
              if (s <= 0) {
                clearInterval(timer);
                triggerFireworks();
              }
            }, 1000);
            return () => clearInterval(timer);
          } else {
            // Already past: Fluid Fast-Spin Reset (1.5s)
            animate(totalSeconds, 0, {
              duration: 2.0,
              ease: "circOut",
              onComplete: () => triggerFireworks()
            });
          }
        }}
        className="flex justify-center gap-3 md:gap-8 font-display text-2xl md:text-4xl text-[#006064] font-bold py-2"
      >
        <CountdownUnit value={totalSeconds} type="h" />
        <span className="text-[#3B1018]/40 mt-1">:</span>
        <CountdownUnit value={totalSeconds} type="m" />
        <span className="text-[#3B1018]/40 mt-1">:</span>
        <CountdownUnit value={totalSeconds} type="s" />
      </motion.div>
    );
  };

  const CountdownUnit = ({ value, type }: { value: any, type: 'h' | 'm' | 's' }) => {
    const derived = useTransform(value, (val: number) => {
      const h = Math.floor((val / 3600) % 24);
      const m = Math.floor((val / 60) % 60);
      const s = Math.floor(val % 60);
      
      if (type === 'h') return String(h).padStart(2, '0');
      if (type === 'm') return String(m).padStart(2, '0');
      return String(s).padStart(2, '0');
    });

    const [display, setDisplay] = useState("00");
    useEffect(() => derived.on("change", (v) => setDisplay(v)), [derived]);

    return (
      <div className="flex flex-col items-center">
        <span>{display}</span>
        <span className="text-[10px] md:text-xs font-body font-bold uppercase tracking-[0.2em] mt-1 text-[#3B1018]/80">
          {type === 'h' ? 'Hours' : type === 'm' ? 'Mins' : 'Secs'}
        </span>
      </div>
    );
  };

  useEffect(() => {
    let triggered = false;
    const unsub = scrollYProgress.on("change", (latest) => {
      // Latch the progress so it never reverses
      if (latest > latchedProgress.get()) {
        latchedProgress.set(latest);
      }

      if (latest > 0.8 && !triggered) {
        triggered = true;
        triggerFireworks();
      } else if (latest < 0.2) {
        triggered = false;
      }
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <section ref={containerRef} className="relative w-full h-[140vh] bg-midnight-maroon">
      {/* Bottom Transition Mask (Melts into Diya Section) */}
      <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-midnight-maroon to-transparent z-[30] pointer-events-none" />

      {/* SVG Filter for Jagged Edges */}
      <svg className="hidden">
        <defs>
          <filter id="jagged-edge" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start pt-[6vh]">
        {/* Underlayer: Patterned Wallpaper */}
        <div
          className="absolute inset-0 z-0 bg-midnight-maroon"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 120c33.137 0 60-26.863 60-60S93.137 0 60 0 0 26.863 0 60s26.863 60 60 60zm0-10c27.614 0 50-22.386 50-50S87.614 10 60 10 10 32.386 10 60s22.386 50 50 50zm0-10c22.091 0 40-17.909 40-40S82.091 20 60 20 20 37.909 20 60s17.909 40 40 40zm0-15c13.807 0 25-11.193 25-25S73.807 35 60 35 35 46.193 35 60s11.193 25 25 25z' fill='%23D4A017' fill-opacity='0.12' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px, cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply',
          }}
        />
        
        <BackgroundStars count={40} />

        {/* Top layer: Maroon seamless blend overlay */}
        <motion.div
          className="absolute inset-0 z-[1] bg-midnight-maroon pointer-events-none"
          style={{ opacity: bgMaroonOpacity }}
        />

        {/* Scene Container - Focused purely on the scroll assembly */}
        <div className="relative z-20 w-full flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-0 relative z-30 px-4"
          >
            <h2 className="font-heading text-3xl md:text-5xl text-saffron-gold mb-1 drop-shadow-md">A Grand Celebration Awaits</h2>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-saffron-gold to-transparent mx-auto rounded-full"></div>
          </motion.div>

          <div className="relative w-[95%] max-w-[850px] mx-auto flex flex-col items-center mt-6">
            {/* Wooden Roll Holder - Overflow visible to allow Tassel to sit in front of everything */}
            <div className="relative z-30 w-full h-[75px] sm:h-[100px] flex justify-center items-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] flex-none overflow-visible">
              <img
                src="/assets/roll.png"
                alt="Roll holder"
                className="absolute w-[125%] h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 brightness-90 contrast-125 pointer-events-none block"
              />
              <motion.img
                src="/assets/tassel.png"
                alt="Tassel"
                className="absolute pointer-events-none origin-top drop-shadow-2xl z-40"
                style={{
                  width: '65%',
                  right: '-16.5%',   // Repositioned to the intersection of bar and right circle
                  top: '65%',    // Attached to the bottom of the intersection
                  zIndex: 10,
                }}
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              />
            </div>

            {/* The Scroll Body Wrapper */}
            <motion.div
              className="relative z-10 w-[76%] -mt-8 origin-top shadow-[0_40px_80px_rgba(0,0,0,0.95)]"
              style={{ opacity: parchmentOpacity }}
            >
              <div className="relative w-full" style={{ minHeight: '40vh' }}>

                {/* 1. Background Layer (Jagged and Filtered) */}
                <motion.div
                  style={{
                    clipPath,
                    filter: 'url(#jagged-edge)',
                    backgroundImage: 'url("/assets/scroll-bg.png")',
                    backgroundSize: '100% 100%',
                  }}
                  className="absolute inset-0 z-0 origin-top w-full h-full"
                >
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(92,36,15,0.6),inset_0_0_80px_rgba(0,0,0,0.4)] mix-blend-multiply z-10" />
                  <div className="absolute inset-0 bg-mandala opacity-[0.08] z-0" />
                </motion.div>

                {/* 2. Content Layer (Clean and Straight) */}
                <motion.div
                  style={{ clipPath }}
                  className="relative z-20 w-full h-full origin-top flex flex-col justify-between"
                >
                  <motion.div
                    className="p-6 md:p-10 text-center flex-grow flex flex-col justify-center border-x-4 border-y border-dashed border-[#8B6508]/30 mx-3 sm:mx-6 my-3 sm:my-4"
                    style={{ y: innerContentY, opacity: innerContentOpacity }}
                  >
                    <p className="font-display text-xl md:text-3xl text-[#3B1018] mb-4 sm:mb-6 leading-relaxed font-bold relative z-10">
                      In the heart of the desert, where the sands whisper tales of valor and the stars shine like scattered diamonds, we gather to celebrate a milestone.
                    </p>
                    <p className="font-body text-bold md:text-xl text-[#4A141E] mb-6 sm:mb-8 font-medium relative z-10">
                      आइए, मनमोहक संगीत, शाही माहौल और यादगार पलों से भरे इस भव्य उत्सव में शामिल हों।
                    </p>

                    <div className="mt-1 sm:mt-2 p-3 sm:p-4 border border-[#B8860B]/40 rounded-t-3xl rounded-b-lg bg-[#F5E6C8]/60 relative overflow-hidden shadow-inner z-10 backdrop-blur-sm">
                      <h3 className="font-heading text-sm sm:text-base text-[#3B1018] mb-2 sm:mb-3 uppercase tracking-[0.15em] font-bold">The Royal Ceremony Begins In</h3>
                      <CountdownDisplay />
                    </div>
                  </motion.div>

                  <div className="h-6 sm:h-8 w-full bg-gradient-to-t from-black/50 via-black/20 to-transparent mt-auto relative z-20 mix-blend-multiply border-b-2 border-dashed border-[#8B6508]/30" />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};