import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Whoami() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col terminal-line font-mono">
      <div className="mb-2 mt-2 w-full flex justify-center md:justify-start overflow-hidden">
        <pre className="text-[#00ff88] font-bold leading-tight drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] text-[3.5px] min-[400px]:text-[4.5px] sm:text-[6px] md:text-[8px] lg:text-[10px] whitespace-pre overflow-x-hidden">
{`███╗   ███╗ █████╗ ██████╗ ██╗      ██████╗ ███╗   ██╗    ██████╗  █████╗ ████████╗ █████╗ ██╗     ██╗  ██╗ █████╗ 
████╗ ████║██╔══██╗██╔══██╗██║     ██╔═══██╗████╗  ██║    ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║     ██║  ██║██╔══██╗
██╔████╔██║███████║██████╔╝██║     ██║   ██║██╔██╗ ██║    ██████╔╝███████║   ██║   ███████║██║     ███████║███████║
██║╚██╔╝██║██╔══██║██╔══██╗██║     ██║   ██║██║╚██╗██║    ██╔══██╗██╔══██║   ██║   ██╔══██║██║     ██╔══██║██╔══██║
██║ ╚═╝ ██║██║  ██║██║  ██║███████╗╚██████╔╝██║ ╚████║    ██████╔╝██║  ██║   ██║   ██║  ██║███████╗██║  ██║██║  ██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝`}
        </pre>
      </div>

      <div className="border-t border-[#1e1e1e] w-full max-w-[480px] my-3"></div>

      <div className="flex flex-col gap-1">
        <div className="text-[#888] text-sm md:text-base">
          <span className="text-[#00cfff]">{t('Desenvolvedor Full Stack', 'Full Stack Developer')}</span>
          <span className="mx-2">·</span>
          <span>Rio de Janeiro, BR</span>
        </div>
        
        <div className="mt-2 text-[#00cfff] text-sm md:text-base drop-shadow-[0_0_5px_rgba(0,207,255,0.4)]">
          {t('Digite "ajuda" para ver os comandos disponíveis.', 'Type "help" to see available commands.')}
        </div>
      </div>
    </div>
  );
}