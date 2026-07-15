import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      const bounds = imgRef.current.getBoundingClientRect();
      setRect({
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      });
    }
    
    setIsAnimating(true);
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    
    // Aguarda um pequeno ciclo para o DOM renderizar a posição inicial antes de animar
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 20);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
    
    // Aguarda a animação CSS (500ms) terminar antes de desmontar o Portal
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl text-[#e8e8e8] terminal-line">
      <div className="flex items-center gap-4 border-b border-[#222] pb-4 mb-2 relative">
        <div 
          ref={imgRef}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)] shrink-0 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => {
            e.stopPropagation();
            if (typeof window !== 'undefined' && window.innerWidth <= 640) {
              if (isHovered) {
                handleMouseLeave();
              } else {
                handleMouseEnter();
              }
            }
          }}
        >
          <div className="absolute inset-0 bg-[#00ff88]/20 transition-colors duration-500 z-10 pointer-events-none mix-blend-overlay"></div>
          {/* Esconde a imagem original enquanto faz a transição para criar a ilusão de que ela "descolou" */}
          <Image 
            src="/image/1001077215.jpg" 
            alt="Marlon Batalha" 
            fill
            sizes="96px"
            quality={100}
            className={`object-cover grayscale transition-all duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {/* Overlay centralizado usando React Portal com animação FLIP */}
        {mounted && (isHovered || isAnimating) && createPortal(
          <div 
            className={`fixed inset-0 z-[9999] transition-all duration-500 ${isHovered ? 'bg-black/60 backdrop-blur-sm pointer-events-auto' : 'bg-transparent backdrop-blur-none pointer-events-none'}`}
            onClick={(e) => {
              e.stopPropagation();
              handleMouseLeave();
            }}
          >
            {rect && (
              <div 
                className={`absolute rounded-full overflow-hidden border-2 border-[#00ff88] shadow-[0_0_60px_rgba(0,255,136,0.5)] transition-all duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  top: isHovered ? '50%' : `${rect.top}px`,
                  left: isHovered ? '50%' : `${rect.left}px`,
                  width: isHovered ? (typeof window !== 'undefined' && window.innerWidth < 640 ? '288px' : '384px') : `${rect.width}px`,
                  height: isHovered ? (typeof window !== 'undefined' && window.innerWidth < 640 ? '288px' : '384px') : `${rect.height}px`,
                  transform: isHovered ? 'translate(-50%, -50%)' : 'translate(0, 0)',
                }}
              >
                <Image 
                  src="/image/1001077215.jpg" 
                  alt="Marlon Batalha" 
                  fill
                  sizes="512px"
                  quality={100}
                  className={`object-cover transition-all duration-500 ${isHovered ? 'grayscale-0' : 'grayscale'}`}
                />
              </div>
            )}
          </div>,
          document.body
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#00cfff]">Marlon Batalha</h2>
          <p className="text-[#00ff88] text-xs sm:text-sm">{t('Desenvolvedor Full Stack Jr', 'Full Stack Jr Developer')}</p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm md:text-base leading-relaxed mt-2">
        <p>
          {t(
            'Olá! Sou um desenvolvedor com mais de 1 ano de experiência, apaixonado por criar soluções rápidas e imersivas. Gosto de resolver problemas complexos com código simples e elegante.',
            'Hello! I am a developer with over 1 year of experience, passionate about creating fast and immersive solutions. I enjoy solving complex problems with simple and elegant code.'
          )}
        </p>
        <p>
          {t(
            'Atuo tanto no ecossistema JavaScript/TypeScript (React, Next.js, Node.js) quanto com back-end estruturado em .NET C#. Além disso, possuo experiência no gerenciamento de bancos de dados SQL e arquitetura de nuvem utilizando Azure Services.',
            'I work with both the JavaScript/TypeScript ecosystem (React, Next.js, Node.js) and structured back-ends in .NET C#. Additionally, I have experience managing SQL databases and cloud architecture using Azure Services.'
          )}
        </p>
      </div>
    </div>
  );
}