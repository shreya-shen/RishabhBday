import React, { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';
import { Volume2, VolumeX, Music } from 'lucide-react';

const GLOBAL_TRACK = '/audio/sarod.mp3'; // Royal Rajasthani Folk

export const Soundscape: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true); // Compliance with autoplay
  const [isInterrupted, setIsInterrupted] = useState(false); // Paused by Jukebox
  const [volume, setVolume] = useState(0.2);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    howlRef.current = new Howl({
      src: [GLOBAL_TRACK],
      loop: true,
      volume: 0.2,
      html5: true,
    });

    // Listen for events
    const handleJukeboxPlay = () => setIsInterrupted(true);
    const handleJukeboxPause = () => setIsInterrupted(false);
    const handleEnter = () => setIsMuted(false);

    window.addEventListener('jukebox-play', handleJukeboxPlay);
    window.addEventListener('jukebox-stop', handleJukeboxPause);
    window.addEventListener('palace-enter', handleEnter);

    return () => {
      if (howlRef.current) howlRef.current.unload();
      window.removeEventListener('jukebox-play', handleJukeboxPlay);
      window.removeEventListener('jukebox-stop', handleJukeboxPause);
      window.removeEventListener('palace-enter', handleEnter);
    };
  }, []);

  // Handle Play/Pause/Mute logic
  useEffect(() => {
    if (!howlRef.current) return;

    const howl = howlRef.current;
    const shouldBePlaying = !isMuted && !isInterrupted;

    // Clear any previously registered fade events to prevent pause race conditions
    howl.off('fade');

    if (shouldBePlaying) {
      if (!howl.playing()) {
        howl.volume(0);
        howl.play();
        howl.fade(0, volume, 500);
      } else {
        howl.fade(howl.volume(), volume, 500);
      }
    } else {
      if (howl.playing()) {
        howl.fade(howl.volume(), 0, 500);
        howl.once('fade', () => {
          howl.pause();
        });
      }
    }
  }, [isMuted, isInterrupted, volume]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-deep-burgundy/90 backdrop-blur-md p-3 rounded-full border-2 border-saffron-gold shadow-2xl">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="w-10 h-10 rounded-full bg-parchment-cream flex items-center justify-center text-midnight-maroon hover:bg-saffron-gold transition-all shadow-inner"
        title={isMuted ? "Unmute Global Music" : "Mute Global Music"}
      >
        {isMuted || isInterrupted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      
      {isInterrupted && (
        <div className="text-[10px] text-saffron-gold font-bold uppercase tracking-tighter px-2 animate-pulse">
          Jukebox Active
        </div>
      )}

      <button
        onClick={() => {
          document.getElementById('music-jukebox')?.scrollIntoView({ behavior: 'smooth' });
        }}
        title="Go to Music Jukebox"
        className="w-10 h-10 rounded-full border-2 border-saffron-gold/50 flex items-center justify-center text-saffron-gold bg-black/20 hover:bg-saffron-gold/20 hover:scale-110 transition-all cursor-pointer"
      >
        <Music size={16} className={(!isMuted && !isInterrupted) ? 'animate-spin-slow' : ''} />
      </button>
    </div>
  );
};
