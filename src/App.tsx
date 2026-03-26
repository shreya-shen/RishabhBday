/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeroSection } from './components/HeroSection';
import { RoyalReveal } from './components/RoyalReveal';
import { DiyaSection } from './components/DiyaSection';
import { MusicJukebox } from './components/MusicJukebox';
import { CamelGame } from './components/CamelGame';
import { CakeCutting } from './components/CakeCutting';
import { LanternLaunch } from './components/LanternLaunch';
import { Footer } from './components/Footer';
import { PuppetLayer } from './components/PuppetLayer';
import { Soundscape } from './components/Soundscape';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [isInGame, setIsInGame] = useState(false);

  return (
    <div className={`min-h-screen bg-[#0a0508] text-ivory-text font-body overflow-x-hidden relative ${!isEntered ? 'overflow-hidden h-screen' : ''}`}>
      {/* Global Faded Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-5 pointer-events-none mix-blend-luminosity"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1599661559895-3b994539665d?q=80&w=2000&auto=format&fit=crop")', // Rajasthani architecture
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      ></div>

      <Soundscape />
      <PuppetLayer isGameActive={isInGame} />
      
      <div className="relative z-20 w-full overflow-hidden">
        <HeroSection isEntered={isEntered} setIsEntered={setIsEntered} />
        {isEntered && (
          <>
            <RoyalReveal />
            <DiyaSection />
            <MusicJukebox />
            <motion.div 
              onViewportEnter={() => setIsInGame(true)}
              onViewportLeave={() => setIsInGame(false)}
              viewport={{ amount: 0.3 }}
            >
              <CamelGame />
            </motion.div>
            <CakeCutting />
            <LanternLaunch />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}
