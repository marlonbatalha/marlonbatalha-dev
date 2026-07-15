import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 max-w-2xl text-[#e8e8e8] terminal-line">
      <div className="flex items-center gap-4 border-b border-[#222] pb-4 mb-2">
        <div className="w-16 h-16 bg-[#00cfff] bg-opacity-20 rounded-full flex items-center justify-center text-[#00cfff] font-bold text-xl border border-[#00cfff]">
          MB
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#00cfff]">Marlon Batalha</h2>
          <p className="text-[#00ff88] text-sm">{t('Desenvolvedor Full Stack Jr', 'Full Stack Jr Developer')}</p>
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