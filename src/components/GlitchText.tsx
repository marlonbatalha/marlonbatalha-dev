import React, { ElementType, useState, useEffect } from 'react';

type Intensity = 'subtle' | 'normal' | 'intense';

interface GlitchTextProps {
  text: string;
  intensity?: Intensity;
  as?: ElementType;
  className?: string;
  triggerOnHover?: boolean;
  autoPlay?: boolean;
}

export default function GlitchText({
  text,
  intensity = 'normal',
  as: Component = 'h1',
  className = '',
  triggerOnHover = false,
  autoPlay = true,
}: GlitchTextProps) {
  const [currentIntensity, setCurrentIntensity] = useState<Intensity>(intensity);

  useEffect(() => {
    if (autoPlay && intensity === 'normal') {
      const timeout = setTimeout(() => {
        setCurrentIntensity('subtle');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [autoPlay, intensity]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      setCurrentIntensity('intense');
    }
  };

  const handleMouseLeave = () => {
    if (triggerOnHover) {
      setCurrentIntensity(autoPlay ? 'subtle' : intensity);
    }
  };

  return (
    <Component
      className={`glitch-text-wrapper ${className}`}
      data-text={text}
      data-intensity={currentIntensity}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={text}
    >
      {text}
    </Component>
  );
}
