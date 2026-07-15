import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 max-w-2xl text-[#e8e8e8] terminal-line">
      <div className="flex items-center gap-4 border-b border-[#222] pb-4 mb-2">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)] shrink-0 group hover:scale-[3.5] sm:hover:scale-[4] hover:z-50 hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all duration-500 origin-top-left cursor-pointer">
          <div className="absolute inset-0 bg-[#00ff88]/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none mix-blend-overlay"></div>
          <Image 
            src="/image/1001077215.jpg" 
            alt="Marlon Batalha" 
            fill
            sizes="512px"
            quality={100}
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#00cfff]">Marlon Batalha</h2>
          <p className="text-[#00ff88] text-xs sm:text-sm">{t('Desenvolvedor Full Stack Jr', 'Full Stack Jr Developer')}</p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm md:text-base leading-relaxed">
        <p>
          {t(
            'Olá! Sou um desenvolvedor apaixonado por criar experiências web rápidas e imersivas. Gosto de resolver problemas complexos com código simples e elegante.',
            'Hello! I am a developer passionate about creating fast and immersive web experiences. I enjoy solving complex problems with simple and elegant code.'
          )}
        </p>
        <p>
          {t(
            'Atualmente com foco no ecossistema JavaScript/TypeScript, construindo aplicações modernas com React e Next.js no front-end, e Node.js no back-end.',
            'Currently focused on the JavaScript/TypeScript ecosystem, building modern applications with React and Next.js on the front-end, and Node.js on the back-end.'
          )}
        </p>
      </div>
    </div>
  );
}