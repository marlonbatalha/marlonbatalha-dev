import React, { ElementType, useState, useEffect } from 'react';

/**
 * Força do efeito glitch (deslocamento RGB do texto):
 * - `subtle`: leve, para ficar ligado o tempo todo sem distrair.
 * - `normal`: padrão; com `autoPlay`, cai para `subtle` depois de 2 segundos.
 * - `intense`: forte, para momentos de destaque (ex.: hover, easter eggs).
 */
type Intensity = 'subtle' | 'normal' | 'intense';

interface GlitchTextProps {
  /** Texto exibido. Também vai para `data-text` (usado pelo CSS do efeito) e `aria-label`. */
  text: string;
  /** Intensidade inicial. Padrão: `normal`. */
  intensity?: Intensity;
  /** Tag HTML ou componente a renderizar (`h1`, `h2`, `span`...). Padrão: `h1`. */
  as?: ElementType;
  /** Classes extras (tamanho, cor...). */
  className?: string;
  /** Se `true`, o glitch fica `intense` enquanto o mouse estiver sobre o texto. */
  triggerOnHover?: boolean;
  /** Se `true`, o efeito anima sozinho em loop. Padrão: `true`. */
  autoPlay?: boolean;
}

/**
 * Texto com efeito glitch de monitor com defeito (faixas vermelha/ciano
 * deslocadas). O efeito é só CSS (`.glitch-text-wrapper` em `globals.css`)
 * e é desligado com `prefers-reduced-motion`.
 */
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
