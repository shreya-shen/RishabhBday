import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Howl, Howler } from 'howler';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { BackgroundStars } from './BackgroundStars';

const tracks = [
  { id: 1, title: 'Chaudhary', src: '/audio/Chaudhary.mp3' },
  { id: 2, title: 'Chudi Chamke', src: '/audio/ChudiChamke.mp3' },
  { id: 3, title: 'Hivde Ro Haar', src: '/audio/HivdeRoHaar.mp3' },
  { id: 4, title: 'Jalalo Bilalo', src: '/audio/JalaloBilalo.mp3' },
  { id: 5, title: 'Jala Sain', src: '/audio/JalaSain.mp3' },
  { id: 6, title: 'Kesariya Balam', src: '/audio/KesariyaBalam.mp3' },
  { id: 7, title: 'Mevadna Maharajane Khamma Re Khamma', src: '/audio/MevadnaMaharajaneKhammaReKhamma.mp3' },
  { id: 8, title: 'Naina Ra Lobhi', src: '/audio/NainaRaLobhi.mp3' },
  { id: 9, title: 'Piya Tosu', src: '/audio/PiyaTosu.mp3' },
  { id: 10, title: 'Sundar Gori', src: '/audio/SundarGori.mp3' },
];

export const MusicJukebox: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [tracks[currentTrackIndex].src],
      html5: true,
      onend: () => handleNext(),
    });

    if (isPlaying) {
      soundRef.current.play();
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Sync with global soundscape
  useEffect(() => {
    if (isPlaying) {
      window.dispatchEvent(new CustomEvent('jukebox-play'));
    } else {
      window.dispatchEvent(new CustomEvent('jukebox-stop'));
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <section className="relative w-full min-h-screen bg-sand-beige py-24 flex flex-col items-center justify-center overflow-hidden">
      {/* Royal Wallpaper Background */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'url("/references/reference2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Soft fade vignette over the wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-gold/40 via-transparent to-amber-gold/40 pointer-events-none z-0" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#41191A] to-transparent z-5 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-midnight-maroon to-transparent z-5 pointer-events-none" />
      
      <BackgroundStars count={60} />

      {/* Background Textures */}
      <div className="absolute inset-0 bg-bandhani opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-mandala opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-paisley opacity-5 pointer-events-none"></div>

      <div className="z-10 text-center mb-12 relative">
        <h2 className="font-heading text-4xl md:text-5xl text-midnight-maroon mb-6 drop-shadow-sm font-bold">Royal Durbar Melodies</h2>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-midnight-maroon to-transparent mx-auto rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center justify-center">
        
        {/* Sarangi/Instrument Visualizer Area */}
        <div className="relative w-full md:w-1/2 max-w-md flex flex-col items-center">
          {/* Top Decorative Element (Sarangi Pegbox) */}
          <div className="w-32 h-16 bg-deep-burgundy rounded-t-3xl border-4 border-saffron-gold border-b-0 relative z-20 flex justify-between px-4 items-center">
             <div className="w-4 h-4 rounded-full bg-saffron-gold shadow-sm"></div>
             <div className="w-4 h-4 rounded-full bg-saffron-gold shadow-sm"></div>
             <div className="w-4 h-4 rounded-full bg-saffron-gold shadow-sm"></div>
          </div>
          
          {/* Main Body (Sarangi Resonator) */}
          <div className="w-full aspect-[3/4] bg-deep-burgundy rounded-t-full rounded-b-3xl border-8 border-saffron-gold shadow-royal flex flex-col items-center justify-center relative overflow-hidden z-10">
            {/* Inner Decorative Border */}
            <div className="absolute inset-4 border-2 border-dashed border-saffron-gold/40 rounded-t-full rounded-b-2xl"></div>
            
            {/* Sound Hole / Visualizer */}
            <div className="w-48 h-48 bg-parchment-cream/10 rounded-full border-4 border-saffron-gold/60 flex items-center justify-center relative overflow-hidden backdrop-blur-sm mt-8">
              {/* Animated Visualizer Bars */}
              <div className="flex items-end justify-center gap-2 h-24 w-full px-4">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-saffron-gold to-peacock-turquoise rounded-t-full"
                    animate={{
                      height: isPlaying ? [10, Math.random() * 80 + 20, 10] : 10,
                    }}
                    transition={{
                      duration: 0.4 + Math.random() * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Strings Overlay */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 flex justify-between pointer-events-none opacity-40">
              <div className="w-0.5 h-full bg-parchment-cream"></div>
              <div className="w-0.5 h-full bg-parchment-cream"></div>
              <div className="w-0.5 h-full bg-parchment-cream"></div>
            </div>

            {/* Center Record Label */}
            <div className="absolute bottom-12 w-24 h-24 bg-parchment-cream rounded-full border-4 border-saffron-gold flex flex-col items-center justify-center shadow-inner z-20">
              <span className="font-decorative text-midnight-maroon text-xs uppercase tracking-widest font-bold">Track</span>
              <span className="font-display text-midnight-maroon text-3xl font-bold">{currentTrackIndex + 1}</span>
            </div>
          </div>
        </div>

        {/* Playlist & Controls */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          
          {/* Playlist */}
          <div className="flex flex-col gap-3 bg-midnight-maroon/85 backdrop-blur-md p-6 rounded-2xl border-2 border-saffron-gold/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative">
            <div className="absolute -top-3 left-6 bg-saffron-gold px-4 py-1 rounded-full text-midnight-maroon font-decorative text-sm tracking-widest uppercase font-bold shadow-md">Playlist</div>
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                className={`p-4 rounded-xl border-l-4 cursor-pointer transition-all flex items-center justify-between ${
                  index === currentTrackIndex
                    ? 'bg-saffron-gold/15 border-saffron-gold shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-ivory-text/10'
                }`}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                whileHover={{ x: 5 }}
              >
                <div>
                  <h3 className={`font-heading text-xl ${index === currentTrackIndex ? 'text-saffron-gold font-bold' : 'text-ivory-text/80'}`}>
                    {track.title}
                  </h3>
                </div>
                {index === currentTrackIndex && isPlaying && (
                  <motion.div 
                    className="w-6 h-6 rounded-full border-2 border-peacock-turquoise flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="w-2 h-2 bg-peacock-turquoise rounded-full"></div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-deep-burgundy p-6 rounded-2xl border-4 border-saffron-gold shadow-royal flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-bandhani opacity-20 pointer-events-none"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={handlePrev} className="text-ivory-text hover:text-saffron-gold transition-colors">
                  <SkipBack size={28} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-parchment-cream flex items-center justify-center text-midnight-maroon shadow-[0_0_20px_rgba(212,160,23,0.4)] hover:scale-105 transition-transform border-2 border-saffron-gold"
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={handleNext} className="text-ivory-text hover:text-saffron-gold transition-colors">
                  <SkipForward size={28} />
                </button>
              </div>

              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-full border border-saffron-gold/30">
                <button onClick={toggleMute} className="text-ivory-text hover:text-saffron-gold transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-24 h-1.5 bg-parchment-cream/30 rounded-lg appearance-none cursor-pointer accent-saffron-gold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
