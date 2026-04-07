"use client"

import React, { useState, useEffect } from 'react';

const PARTICLE_COUNT = 50; // Increased for a denser, more premium feel

interface Particle {
  id: number;
  style: React.CSSProperties;
}

const BottomGlowEffect = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = Math.random() * 2.5 + 1; // 1px to 3.5px
        const duration = Math.random() * 9 + 6; // 6s to 15s
        const delay = Math.random() * 12; // 0s to 12s
        const x = Math.random() * 100; // 0% to 100%
        const drift = (Math.random() - 0.5) * 50; // Horizontal drift between -25px and 25px
        
        newParticles.push({
          id: i,
          style: {
            position: 'absolute',
            bottom: 0,
            left: `${x}%`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--primary))',
            boxShadow: `0 0 6px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 16px hsl(var(--accent))`,
            animation: `impressive-particle-rise ${duration}s ease-in-out ${delay}s infinite`,
            opacity: 0,
            willChange: 'transform, opacity',
            // CSS custom property for the animation
            ['--particle-drift' as any]: `${drift}px`,
          },
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[250px] overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: Wide, soft accent color base for depth */}
      <div className="absolute bottom-0 left-1/2 h-64 w-[250%] -translate-x-1/2 animate-luxury-pulse bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--accent)/0.15)_0%,transparent_100%)] opacity-80" style={{ animationDuration: '10s' }}/>

      {/* Layer 2: Main primary color glow */}
      <div className="absolute bottom-0 left-1/2 h-56 w-[200%] -translate-x-1/2 animate-luxury-pulse-fast bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.25)_0%,transparent_100%)]" style={{ animationDuration: '7s' }}/>
      
      {/* Layer 3: Brighter, focused core pulse */}
      <div className="absolute bottom-0 left-1/2 h-40 w-[100%] -translate-x-1/2 animate-luxury-pulse-fast bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.5)_0%,transparent_100%)] opacity-90" style={{ animationDuration: '5s' }}/>

      {/* Particles */}
      <div className="absolute inset-0">
        {particles.map(p => (
          <div key={p.id} style={p.style} />
        ))}
      </div>
    </div>
  );
};

export default BottomGlowEffect;
