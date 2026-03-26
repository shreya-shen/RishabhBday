import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import { BackgroundStars } from './BackgroundStars';

export const CakeCutting: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isCut, setIsCut] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cakeImg, setCakeImg] = useState<HTMLImageElement | null>(null);
  const soundRef = useRef<Howl | null>(null);

  // Mutable state for drawing and slicing animation
  const stateRef = useRef({
    dragStart: { x: 0, y: 0 },
    dragCurrent: { x: 0, y: 0 },
    cutLine: null as { start: {x:number, y:number}, end: {x:number, y:number} } | null,
    separation: 0,
    isAnimating: false
  });

  // Load image reliably
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log("Cake image loaded successfully");
      setCakeImg(img);
    };
    img.onerror = () => console.error("Cake image failed to load");
    img.src = '/assets/birthday-cake.png';
  }, []);

  // Set up audio
  useEffect(() => {
    soundRef.current = new Howl({
      src: ['https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3'], 
      volume: 0.5,
      html5: true,
    });
    return () => { if (soundRef.current) soundRef.current.unload(); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !cakeImg) return;

    let animId: number;

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        const w = containerRef.current.clientWidth || window.innerWidth;
        const h = containerRef.current.clientHeight || window.innerHeight;
        canvas.width = w;
        canvas.height = h;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const draw = () => {
      if (containerRef.current && canvas) {
        const w = containerRef.current.clientWidth || window.innerWidth;
        const h = containerRef.current.clientHeight || window.innerHeight;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const state = stateRef.current;

      const imgRatio = cakeImg.naturalWidth / cakeImg.naturalHeight;
      let drawH = canvas.height * 0.45;
      let drawW = drawH * imgRatio;

      const drawX = canvas.width / 2 - drawW / 2;
      const drawY = canvas.height / 2 - drawH / 2 + (canvas.height * 0.1); // Shifted down 10% of window height

      if (!state.cutLine) {
        ctx.drawImage(cakeImg, drawX, drawY, drawW, drawH);

        if (isDragging) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(state.dragStart.x, state.dragStart.y);
          ctx.lineTo(state.dragCurrent.x, state.dragCurrent.y);
          ctx.strokeStyle = '#D4A017';
          ctx.shadowColor = '#D4A017';
          ctx.shadowBlur = 10;
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }
      } else {
        const { start, end } = state.cutLine;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        
        if (len > 0) {
          const vx = dx / len;
          const vy = dy / len;
          const nx = -vy;
          const ny = vx;

          const EXTENT = 5000;
          const p1x = start.x - vx * EXTENT;
          const p1y = start.y - vy * EXTENT;
          const p2x = end.x + vx * EXTENT;
          const p2y = end.y + vy * EXTENT;

          if (state.isAnimating) {
            state.separation += (60 - state.separation) * 0.08;
          }
          const offset = state.separation;

          // SIDE 1
          ctx.save();
          ctx.translate(nx * offset, ny * offset);
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.lineTo(p2x + nx * EXTENT, p2y + ny * EXTENT);
          ctx.lineTo(p1x + nx * EXTENT, p1y + ny * EXTENT);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(cakeImg, drawX, drawY, drawW, drawH);
          ctx.restore();

          // SIDE 2
          ctx.save();
          ctx.translate(-nx * offset, -ny * offset);
          ctx.beginPath();
          ctx.moveTo(p2x, p2y);
          ctx.lineTo(p1x, p1y);
          ctx.lineTo(p1x - nx * EXTENT, p1y - ny * EXTENT);
          ctx.lineTo(p2x - nx * EXTENT, p2y - ny * EXTENT);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(cakeImg, drawX, drawY, drawW, drawH);
          ctx.restore();
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [cakeImg, isDragging]);

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCut) return;
    const pos = getPointerPos(e);
    stateRef.current.dragStart = pos;
    stateRef.current.dragCurrent = pos;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isCut) return;
    stateRef.current.dragCurrent = getPointerPos(e);
  };

  const handlePointerUp = () => {
    if (!isDragging || isCut) return;
    setIsDragging(false);
    const dist = Math.sqrt(Math.pow(stateRef.current.dragCurrent.x - stateRef.current.dragStart.x, 2) + Math.pow(stateRef.current.dragCurrent.y - stateRef.current.dragStart.y, 2));
    if (dist > 80) {
      stateRef.current.cutLine = { start: stateRef.current.dragStart, end: stateRef.current.dragCurrent };
      stateRef.current.isAnimating = true;
      setIsCut(true);
      if (soundRef.current) soundRef.current.play();
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#D4A017', '#6B1220', '#006064'] });
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#070005]">
      <BackgroundStars count={60} />
      {/* Background Mask */}
      <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />

      {/* Transition Masks for smooth flow */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-midnight-maroon to-transparent z-[5] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#070005] to-transparent z-[5] pointer-events-none" />

      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-[30] text-center w-full px-4 pointer-events-none flex flex-col items-center">
        <h2 className="font-heading text-5xl md:text-7xl text-ivory-text mb-6 font-bold drop-shadow-lg">The Royal Cake</h2>
        
        <AnimatePresence mode="wait">
          {!isCut ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black/60 backdrop-blur-md px-8 py-3 rounded-full border-2 border-saffron-gold/80"
            >
              <p className="font-body text-saffron-gold font-bold text-xl md:text-2xl m-0 tracking-wide">
                Drag to slice the cake!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-deep-burgundy/90 backdrop-blur-md px-10 py-5 rounded-3xl border-4 border-saffron-gold shadow-2xl mt-4"
            >
              <h3 className="font-heading text-4xl md:text-6xl text-saffron-gold mb-2 font-bold">Happy Birthday!</h3>
              <p className="font-body text-ivory-text font-medium text-lg md:text-xl uppercase tracking-widest">A royal treat for a royal soul.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div ref={containerRef} className="absolute inset-0 w-full h-full z-[10] flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseOut={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>
    </section>
  );
};
