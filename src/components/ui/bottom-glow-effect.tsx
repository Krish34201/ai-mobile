"use client"

import React, { useState, useEffect } from 'react';

const PARTICLE_COUNT = 60; // Increased for a denser, more premium feel

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
        const duration = Math.random() * 11 + 7; // 7s to 18s (slower, more elegant)
        const delay = Math.random() * 15; // 0s to 15s
        const x = Math.random() * 100; // 0% to 100%
        const drift = (Math.random() - 0.5) * 60; // Increased horizontal drift for more movement
        
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
            // Brighter, more complex glow
            boxShadow: `0 0 8px hsl(var(--primary)), 0 0 14px hsl(var(--primary)), 0 0 22px hsl(var(--accent))`,
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
      {/* Layer 1: Wider, brighter accent color base for a luxurious foundation */}
      <div className="absolute bottom-0 left-1/2 h-64 w-[300%] -translate-x-1/2 animate-luxury-pulse bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--accent)/0.2)_0%,transparent_100%)] opacity-90" style={{ animationDuration: '10s' }}/>

      {/* Layer 2: Main primary color glow - now brighter */}
      <div className="absolute bottom-0 left-1/2 h-56 w-[220%] -translate-x-1/2 animate-luxury-pulse-fast bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.35)_0%,transparent_100%)]" style={{ animationDuration: '8s' }}/>
      
      {/* Layer 3: Brighter, more focused core pulse for that "wow" factor */}
      <div className="absolute bottom-0 left-1/2 h-48 w-[120%] -translate-x-1/2 animate-luxury-pulse-fast bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.65)_0%,transparent_100%)] opacity-100" style={{ animationDuration: '6s' }}/>

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
