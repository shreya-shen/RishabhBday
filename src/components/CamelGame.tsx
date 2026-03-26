import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundStars } from './BackgroundStars';

// Preload assets outside component to eliminate load delay
const bgImage = new Image();
bgImage.src = '/assets/game-bg.png';

const camelImage = new Image();
camelImage.src = '/assets/camel.png';

const cactusImage = new Image();
cactusImage.src = '/assets/cactus.png';

const laddooImage = new Image();
laddooImage.src = '/assets/laddoo.png';

export const CamelGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timePlayed, setTimePlayed] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Resize canvas to fill container
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let camelY = canvas.height - 50;
    let camelVelocity = 15;
    let isJumping = false;
    let obstacles: { x: number; y: number; width: number; height: number }[] = [];
    let collectibles: { x: number; y: number; radius: number; collected: boolean }[] = [];
    let frameCount = 0;
    let currentScore = 0;
    let bgScrollX = 0;
    const startTime = Date.now();

    const camelWidth = 140;
    const camelHeight = 105;
    const gravity = 2.5;
    const jumpStrength = -32;
    let gameSpeed = 15;

    const drawCamel = (x: number, y: number) => {
      if (camelImage.complete && camelImage.naturalWidth > 0) {
        ctx.drawImage(camelImage, x, y, camelWidth, camelHeight);
      } else {
        ctx.fillStyle = '#6B1220';
        ctx.fillRect(x, y, camelWidth, camelHeight);
      }
    };

    const drawBackground = () => {
      if (bgImage.complete && bgImage.naturalWidth > 0) {
        const H = canvas.height;
        // Scale width proportionally to the height
        const drawW = H * (bgImage.naturalWidth / bgImage.naturalHeight);

        // Dynamically tile the background across the entire screen
        let xPos = bgScrollX;
        let isMirrored = false;
        
        while (xPos < canvas.width) {
          if (!isMirrored) {
            ctx.drawImage(bgImage, xPos, 0, drawW, H);
          } else {
            ctx.save();
            ctx.translate(xPos + drawW, 0); // Move origin to right edge of this segment
            ctx.scale(-1, 1); // Flip horizontally
            ctx.drawImage(bgImage, 0, 0, drawW, H);
            ctx.restore();
          }
          xPos += drawW;
          isMirrored = !isMirrored;
        }

        bgScrollX -= gameSpeed / 2;
        // Reset scroll when a full Normal + Mirrored cycle completes
        if (bgScrollX <= -2 * drawW) {
          bgScrollX += 2 * drawW;
        }
      } else {
        ctx.fillStyle = '#F5E6C8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const drawObstacle = (obs: { x: number; y: number; width: number; height: number }) => {
      if (cactusImage.complete && cactusImage.naturalWidth > 0) {
        ctx.drawImage(cactusImage, obs.x, obs.y, obs.width, obs.height);
      } else {
        ctx.fillStyle = '#3B0918'; // Fallback
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      }
    };

    const drawCollectible = (col: { x: number; y: number; radius: number }) => {
      if (laddooImage.complete && laddooImage.naturalWidth > 0) {
        const size = col.radius * 2 * 1.25; // Sized up a bit
        ctx.drawImage(laddooImage, col.x - size/2, col.y - size/2, size, size);
      } else {
        ctx.fillStyle = '#D4A017'; // Gold
        ctx.beginPath();
        ctx.arc(col.x, col.y, col.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const handleJump = (e: KeyboardEvent | TouchEvent | MouseEvent) => {
      if (e.type === 'keydown' && (e as KeyboardEvent).code === 'Space') {
        e.preventDefault();
      }

      if ((e.type === 'keydown' && (e as KeyboardEvent).code === 'Space') || e.type === 'touchstart' || e.type === 'mousedown') {
        if (!isJumping) {
          camelVelocity = jumpStrength;
          isJumping = true;
        }
      }
    };

    window.addEventListener('keydown', handleJump, { passive: false });
    canvas.addEventListener('touchstart', handleJump, { passive: false });
    canvas.addEventListener('mousedown', handleJump);

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gameSpeed += 0.003; 

      // 1. Draw Background
      drawBackground();
      
      // Ground
      ctx.fillStyle = '#C8A96A'; // Sand Beige
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      // 2. Add Camel Physics & Draw
      camelVelocity += gravity;
      camelY += camelVelocity;

      if (camelY > canvas.height - 40 - camelHeight) {
        camelY = canvas.height - 40 - camelHeight;
        camelVelocity = 0;
        isJumping = false;
      }

      // Keep camel horizontally anchored relative to the screen size
      const camelX = Math.min(100, canvas.width * 0.1);
      drawCamel(camelX, camelY);

      // 3. Spawn Entities
      if (frameCount % 80 === 0) {
        const h = 110 + Math.random() * 80;
        obstacles.push({
          x: canvas.width,
          y: canvas.height - 20 - h,
          width: 75 + Math.random() * 50,
          height: h,
        });
      }

      if (frameCount % 60 === 0) {
        collectibles.push({
          x: canvas.width,
          y: canvas.height - 120 - Math.random() * 100,
          radius: 24,
          collected: false,
        });
      }

      // 4. Update & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;
        drawObstacle(obs);

        const hitboxPadding = 35; 
        if (
          camelX + hitboxPadding < obs.x + obs.width - 10 &&
          camelX + camelWidth - hitboxPadding > obs.x + 10 &&
          camelY + hitboxPadding < obs.y + obs.height - 10 &&
          camelY + camelHeight - hitboxPadding > obs.y + 10
        ) {
          setGameOver(true);
          setIsPlaying(false);
          cancelAnimationFrame(animationFrameId);
          return; // Stop loop immediately
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
        }
      }

      // 5. Update & Draw Collectibles
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const col = collectibles[i];
        if (!col.collected) {
          col.x -= gameSpeed;
          drawCollectible(col);

          const distX = Math.abs(col.x - (camelX + camelWidth / 2));
          const distY = Math.abs(col.y - (camelY + camelHeight / 2));

          if (distX < camelWidth / 2 + col.radius && distY < camelHeight / 2 + col.radius) {
            col.collected = true;
            currentScore += 50; 
            setScore(currentScore);
          }
        }

        if (col.x + col.radius < 0 || col.collected) {
          collectibles.splice(i, 1);
        }
      }

      // 6. Stats Increment
      frameCount++;
      if (frameCount % 10 === 0) {
        currentScore += 1; // Base distance score
        setScore(currentScore);
      }

      // Update Stopwatch (seconds)
      const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimePlayed(secondsElapsed);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleJump);
      canvas.removeEventListener('touchstart', handleJump);
      canvas.removeEventListener('mousedown', handleJump);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimePlayed(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-midnight-maroon">
      <BackgroundStars count={60} />
      {/* Bottom Transition Mask (Blends into Cake Section) */}
      <div className="absolute bottom-0 left-0 w-full h-[10vh] bg-gradient-to-t from-midnight-maroon to-transparent z-40 pointer-events-none" />

      {/* ============== PRE-GAME SCREEN ============== */}
      <AnimatePresence>
        {!isPlaying && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center"
          >
            {/* Royal Rajasthani Wallpaper Background */}
            <div 
              className="absolute inset-0"
              style={{
                // backgroundImage: 'url("/references/reference2.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Warm overlay for readability */}
            <div className="absolute inset-0 bg-midnight-maroon/60" />
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 bg-bandhani opacity-10 pointer-events-none" />

            {/* Prominent Title Block */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              className="relative z-10 text-center mb-10 px-6"
            >
              <h2 className="font-heading text-6xl md:text-8xl text-saffron-gold mb-4 uppercase tracking-[0.15em] font-bold drop-shadow-[0_4px_20px_rgba(212,160,23,0.5)]">
                Desert Dash
              </h2>
              <div className="w-40 h-1 bg-gradient-to-r from-transparent via-saffron-gold to-transparent mx-auto rounded-full mb-4" />
              <p className="font-display text-ivory-text/90 text-xl md:text-2xl tracking-[0.1em] italic drop-shadow-md">
                An Endless Royal Journey
              </p>
            </motion.div>

            {/* Rani Pink Instruction Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
              className="relative z-10 bg-[#6B1220]/90 backdrop-blur-md p-8 md:p-12 rounded-3xl border-4 border-saffron-gold shadow-[0_10px_60px_rgba(0,0,0,0.4)] text-center max-w-2xl mx-4"
            >
              {/* Ornamental top */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-saffron-gold px-6 py-1.5 rounded-full text-midnight-maroon font-decorative text-sm tracking-widest uppercase font-bold shadow-md">
                How to Play
              </div>

              <p className="font-body text-ivory-text font-medium text-lg md:text-xl leading-relaxed mt-4 mb-10">
                Help the royal camel cross the endless desert dunes! 
                Press the <strong className="text-saffron-gold font-bold">Spacebar</strong> or <strong className="text-saffron-gold font-bold">Tap the screen</strong> to jump over oncoming obstacles. 
                Collect saffron coins for bonus points!
              </p>

              <button
                onClick={startGame}
                className="px-14 py-5 rounded-2xl bg-midnight-maroon text-saffron-gold font-bold text-2xl uppercase tracking-widest hover:bg-saffron-gold hover:text-midnight-maroon transition-all border-4 border-saffron-gold transform hover:scale-105"
              >
                Start Journey
              </button>
            </motion.div>

            {/* Decorative corner accents */}
            <div className="absolute top-8 left-8 w-20 h-20 border-t-4 border-l-4 border-saffron-gold/40 rounded-tl-3xl pointer-events-none" />
            <div className="absolute top-8 right-8 w-20 h-20 border-t-4 border-r-4 border-saffron-gold/40 rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-8 left-8 w-20 h-20 border-b-4 border-l-4 border-saffron-gold/40 rounded-bl-3xl pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-20 h-20 border-b-4 border-r-4 border-saffron-gold/40 rounded-br-3xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============== GAME CANVAS (always mounted for sizing) ============== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-pointer z-0"
      />

      {/* ============== IN-GAME HUD ============== */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-12">
        
        {/* Top HUD Area */}
        <div className="flex justify-between items-start w-full">
          {/* Logo / Title Area */}
          {(isPlaying || gameOver) && (
            <div className="bg-parchment-cream/80 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-saffron-gold shadow-sm pointer-events-auto">
              <h2 className="font-heading text-2xl md:text-3xl text-midnight-maroon drop-shadow-sm font-bold m-0 border-b-2 border-saffron-gold mb-1">Desert Dash</h2>
              <p className="font-body text-xs text-midnight-maroon/80 font-medium uppercase tracking-widest hidden md:block">Endless Royal Journey</p>
            </div>
          )}

          {/* Score & Stopwatch HUD */}
          {(isPlaying || gameOver) && (
            <div className="flex flex-col gap-3 pointer-events-auto">
              <div className="bg-deep-burgundy/90 backdrop-blur-md px-6 py-2 rounded-xl border-2 border-saffron-gold shadow-md text-right min-w-[140px]">
                <span className="block text-xs text-saffron-gold uppercase tracking-widest font-bold">Score</span>
                <span className="font-display text-ivory-text font-bold text-2xl tracking-widest">{score}</span>
              </div>
              <div className="bg-peacock-turquoise/90 backdrop-blur-md px-6 py-2 rounded-xl border-2 border-saffron-gold shadow-md text-right min-w-[140px]">
                <span className="block text-xs text-saffron-gold uppercase tracking-widest font-bold">Time</span>
                <span className="font-display text-ivory-text font-bold text-2xl tracking-widest">{formatTime(timePlayed)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Center Prompts - Game Over Only */}
        <div className="flex-1 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence>
            {gameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-deep-burgundy/95 backdrop-blur-md p-10 md:p-16 rounded-3xl border-4 border-saffron-gold text-center pointer-events-auto shadow-royal"
              >
                <h3 className="font-heading text-5xl md:text-7xl text-saffron-gold mb-4 drop-shadow-lg font-bold">Journey Ended</h3>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center bg-black/30 px-8 py-6 rounded-2xl border border-saffron-gold/30 mb-10">
                  <div className="text-center">
                    <span className="block text-sm text-ivory-text/80 uppercase tracking-widest mb-1">Final Score</span>
                    <span className="font-display tracking-widest text-4xl text-saffron-gold font-bold">{score}</span>
                  </div>
                  <div className="hidden md:block w-px bg-saffron-gold/30"></div>
                  <div className="text-center">
                    <span className="block text-sm text-ivory-text/80 uppercase tracking-widest mb-1">Time Survived</span>
                    <span className="font-display tracking-widest text-4xl text-saffron-gold font-bold">{formatTime(timePlayed)}</span>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="px-12 py-5 rounded-xl border-4 border-saffron-gold bg-black/40 text-saffron-gold font-bold text-2xl uppercase tracking-wider hover:bg-saffron-gold hover:text-midnight-maroon transition-colors transform hover:scale-105"
                >
                  Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
