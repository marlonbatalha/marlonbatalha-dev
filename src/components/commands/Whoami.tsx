import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TetrisTitleAnim from './TetrisTitleAnim';
import GlitchText from '../GlitchText';
import TypewriterText from '../TypewriterText';

const asciiArt = `███╗   ███╗ █████╗ ██████╗ ██╗      ██████╗ ███╗   ██╗    ██████╗  █████╗ ████████╗ █████╗ ██╗     ██╗  ██╗ █████╗ 
████╗ ████║██╔══██╗██╔══██╗██║     ██╔═══██╗████╗  ██║    ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║     ██║  ██║██╔══██╗
██╔████╔██║███████║██████╔╝██║     ██║   ██║██╔██╗ ██║    ██████╔╝███████║   ██║   ███████║██║     ███████║███████║
██║╚██╔╝██║██╔══██║██╔══██╗██║     ██║   ██║██║╚██╗██║    ██╔══██╗██╔══██║   ██║   ██╔══██║██║     ██╔══██║██╔══██║
██║ ╚═╝ ██║██║  ██║██║  ██║███████╗╚██████╔╝██║ ╚████║    ██████╔╝██║  ██║   ██║   ██║  ██║███████╗██║  ██║██║  ██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝`;

export default function Whoami() {
  const { t } = useLanguage();
  const role = t('Desenvolvedor Full Stack', 'Full Stack Developer');

  const introLines = [
    `${role} · Rio de Janeiro, BR`,
    t('Digite "ajuda" para ver os comandos disponíveis.', 'Type "help" to see available commands.'),
  ];

  const renderIntroLine = (line: string, index: number) => {
    if (index === 0) {
      if (line.length <= role.length) {
        return <span className="text-[#00cfff]">{line}</span>;
      }
      return (
        <span className="text-[#888]">
          <span className="text-[#00cfff]">{role}</span>
          {line.slice(role.length)}
        </span>
      );
    }
    return <span className="text-[#00cfff] drop-shadow-[0_0_5px_rgba(0,207,255,0.4)]">{line}</span>;
  };

  return (
    <div className="flex flex-col terminal-line font-mono">
      <div className="mb-2 mt-2 w-full flex flex-col sm:flex-row justify-center md:justify-start items-center sm:items-end gap-2 sm:gap-6 overflow-hidden">
        <GlitchText
          as="pre"
          text={asciiArt}
          className="text-[#00ff88] font-bold leading-tight drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] text-[2.5px] min-[380px]:text-[3px] min-[420px]:text-[3.5px] sm:text-[5.5px] md:text-[7px] lg:text-[9px] whitespace-pre overflow-hidden"
        />
        <div className="hidden sm:block pb-1 lg:pb-3 shrink-0 transform scale-[0.6] sm:scale-100 origin-bottom-left">
          <TetrisTitleAnim />
        </div>
      </div>

      <div className="border-t border-[#1e1e1e] w-full max-w-[480px] my-3"></div>

      <div className="flex flex-col gap-1 text-sm md:text-base">
        <TypewriterText lines={introLines} renderLine={renderIntroLine} lineDelay={150} />
      </div>
    </div>
  );
}