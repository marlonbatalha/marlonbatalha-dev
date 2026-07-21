import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import TypewriterText from '../TypewriterText';
import GlitchText from '../GlitchText';

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

  // Trava o scroll da página enquanto a animação do overlay está ativa,
  // evitando que o scroll do mouse dessincronize o rect (fixed) da imagem original.
  // overflow:hidden sozinho não bloqueia scroll por wheel/touch em todos os browsers,
  // então travamos a posição com position:fixed e restauramos o scroll ao final.
  useEffect(() => {
    if (!isAnimating) return;
    const scrollY = window.scrollY;
    const { body } = document;
    const original = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = original.overflow;
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.width = original.width;
      window.scrollTo(0, scrollY);
    };
  }, [isAnimating]);

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
    
    // Usamos um pequeno atraso + requestAnimationFrame para garantir que o DOM pinte
    // a posição inicial antes de iniciar a transição, evitando stutter/lags
    hoverTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        setIsHovered(true);
      });
    }, 50);
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
            src="/image/MARLON BATALHA - DESENVOLVIMENTO (1).jpeg" 
            alt="Marlon Batalha" 
            fill
            sizes="96px"
            quality={100}
            className={`object-cover grayscale transition-all duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {/* Preload da versão em alta resolução para evitar travamentos no primeiro hover */}
        <div className="hidden">
          <Image 
            src="/image/MARLON BATALHA - DESENVOLVIMENTO (1).jpeg" 
            alt="Marlon Batalha" 
            fill
            sizes="512px"
            quality={100}
            priority={true}
          />
        </div>

        {/* Overlay centralizado usando React Portal com animação FLIP */}
        {mounted && (isHovered || isAnimating) && createPortal(
          <div 
            className={`fixed inset-0 z-[9999] transition-all duration-500 ${isHovered ? 'bg-black/60 backdrop-blur-sm pointer-events-auto sm:pointer-events-none' : 'bg-transparent backdrop-blur-none pointer-events-none'}`}
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
                  src="/image/MARLON BATALHA - DESENVOLVIMENTO (1).jpeg" 
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
          <GlitchText 
            as="h2" 
            text="Marlon Batalha" 
            className="text-xl sm:text-2xl font-bold text-[#00cfff]" 
            intensity="subtle"
            triggerOnHover={true}
          />
          <p className="text-[#00ff88] text-xs sm:text-sm">{t('Desenvolvedor Full Stack', 'Full Stack Developer')}</p>
        </div>
      </div>
      
      <div className="text-sm md:text-base leading-relaxed mt-2">
        <TypewriterText 
          className="gap-3"
          lines={[
            t(
              'Olá! Sou um Desenvolvedor Full Stack com mais de 1 ano e 6 meses de experiência em desenvolvimento de software e mais de 2 anos na área de tecnologia. Iniciei minha jornada como Jovem Aprendiz e, com destaque, atuei em Suporte de TI e Segurança da Informação por mais de um ano. Essa vivência me proporcionou uma base forte em hardware, software, firewalls, protocolos de rede e mitigação de ataques (DDoS/DTOs).',
              'Hello! I am a Full Stack Developer with over 1.5 years of software development experience and over 2 years in the tech field. I started my journey as an Apprentice (Jovem Aprendiz) and stood out, moving into IT Support and Information Security for over a year. This gave me a solid foundation in hardware, software, firewalls, network protocols, and attack mitigation (DDoS/DTOs).'
            ),
            t(
              'Posteriormente, recebi a oportunidade de ingressar na equipe de desenvolvimento da mesma empresa. Atualmente, faço parte do ambiente completo de desenvolvimento dos sistemas que atuo: desde o frontend e backend, até DevOps, Cloud, Security e CI/CD (GitHub Actions). Tenho orgulho de ter criado sistemas robustos como CRMs, plataformas de gestão de leads e arquiteturas para disparo de e-mails em massa utilizando Azure Services (SQL, Email Communication Services, entre outros).',
              'Later, I earned the opportunity to join the development team at the same company. Currently, I am involved in the complete lifecycle of the systems I work on: from frontend and backend to DevOps, Cloud, Security, and CI/CD (GitHub Actions). I have built robust systems like CRMs, lead management platforms, and mass email architectures using Azure Services (SQL, Email Communication Services, and more).'
            )
          ]} 
        />
      </div>
    </div>
  );
}