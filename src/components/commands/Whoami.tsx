import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TetrisTitleAnim from './TetrisTitleAnim';
import GlitchText from '../ui/GlitchText';
import TypewriterText from '../ui/TypewriterText';

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
        return <span className="text-term-cyan">{line}</span>;
      }
      return (
        <span className="text-term-subtle">
          <span className="text-term-cyan">{role}</span>
          {line.slice(role.length)}
        </span>
      );
    }
    return <span className="text-term-cyan drop-shadow-[0_0_5px_rgba(0,207,255,0.4)]">{line}</span>;
  };

  return (
    <div className="flex flex-col terminal-line font-mono">
      {/* @container: no celular o tamanho da fonte do título é calculado pela
          largura disponível (100cqw / 72 ≈ 116 colunas × 0,6em), para ocupar
          a tela inteira em vez de um tamanho fixo minúsculo. */}
      <div className="@container mb-2 mt-2 w-full flex flex-col sm:flex-row justify-center md:justify-start items-center sm:items-end gap-2 sm:gap-6 overflow-hidden">
        <GlitchText
          as="pre"
          text={asciiArt}
          className="text-term-green font-bold leading-tight drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] text-[calc(100cqw/72)] sm:text-[5.5px] md:text-[7px] lg:text-[9px] whitespace-pre overflow-hidden"
        />
        <div className="hidden sm:block pb-1 lg:pb-3 shrink-0 transform scale-[0.6] sm:scale-100 origin-bottom-left">
          <TetrisTitleAnim />
        </div>
      </div>

      <div className="border-t border-term-line w-full max-w-[480px] my-3"></div>

      <div className="flex flex-col gap-1 text-sm md:text-base">
        <TypewriterText lines={introLines} renderLine={renderIntroLine} lineDelay={150} />
        {/* Só em telas de toque: aponta para a barra de comandos do rodapé. */}
        <p className="hidden pointer-coarse:block text-term-dim text-sm mt-2">
          {t('↓ Ou toque em um comando abaixo.', '↓ Or tap a command below.')}
        </p>
      </div>
    </div>
  );
}