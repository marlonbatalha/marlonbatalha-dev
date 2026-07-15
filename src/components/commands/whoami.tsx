import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Whoami() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-1 terminal-line">
      <div className="border-b border-[#222] pb-4 mb-3">
        <pre className="text-[#00ff88] font-bold leading-tight drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] text-[8px] sm:text-[10px] md:text-xs lg:text-sm overflow-x-hidden">
{` __  __           _                 ____        _        _ _           
|  \\/  | __ _ _ __| | ___  _ __    | __ )  __ _| |_ __ _| | |__   __ _ 
| |\\/| |/ _\` | '__| |/ _ \\| '_ \\   |  _ \\ / _\` | __/ _\` | | '_ \\ / _\` |
| |  | | (_| | |  | | (_) | | | |  | |_) | (_| | || (_| | | | | | (_| |
|_|  |_|\\__,_|_|  |_|\\___/|_| |_|  |____/ \\__,_|\\__\\__,_|_|_| |_|\\__,_|`}
        </pre>
      </div>
      <div className="text-[#e8e8e8] text-base md:text-lg">
        <span className="text-[#00cfff] font-bold drop-shadow-[0_0_5px_rgba(0,207,255,0.4)]">Marlon Batalha</span> <span className="text-[#666]">—</span> {t('Desenvolvedor Full Stack Jr', 'Full Stack Jr Developer')}
      </div>
      <div className="text-[#888] text-sm mt-1">
        {t('Brasil', 'Brazil')} | React, Next.js, TypeScript, Node.js
      </div>
      <div className="text-[#a78bfa] text-xs md:text-sm mt-3 italic opacity-90">
        {t('"Transformando café em código elegante."', '"Turning coffee into elegant code."')}
      </div>
      <div className="mt-5 text-[#666] text-xs md:text-sm">
        {t('Digite', 'Type')} <span className="text-[#00ff88] font-bold drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]">help</span> {t('para ver os comandos disponíveis.', 'to see available commands.')}
      </div>
    </div>
  );
}