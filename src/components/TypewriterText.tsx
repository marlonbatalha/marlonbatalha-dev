import React, { useEffect, useRef } from 'react';
import { useTypewriter, UseTypewriterOptions } from '@/hooks/useTypewriter';

interface TypewriterTextProps extends UseTypewriterOptions {
  className?: string;
  cursorClassName?: string;
  renderLine?: (line: string, index: number) => React.ReactNode;
}

export default function TypewriterText({
  lines,
  baseSpeed,
  humanVariance,
  lineDelay,
  startDelay,
  punctuationDelay,
  onComplete,
  skip,
  className = '',
  cursorClassName = 'text-[#00ff88] animate-pulse',
  renderLine,
}: TypewriterTextProps) {
  const { displayedLines, isTyping, isComplete } = useTypewriter({
    lines,
    baseSpeed,
    humanVariance,
    lineDelay,
    startDelay,
    punctuationDelay,
    onComplete,
    skip,
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTyping && bottomRef.current) {
      const container = bottomRef.current.closest('.overflow-y-auto');
      if (container) {
         container.scrollTop = container.scrollHeight;
      } else {
         bottomRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    }
  }, [displayedLines, isTyping]);

  // Bloqueia a rolagem do usuário enquanto a digitação acontece. O autoscroll
  // acima continua funcionando (é programático); aqui só a entrada do usuário
  // é bloqueada, que era o que brigava com o autoscroll a cada caractere e
  // quebrava a animação.
  useEffect(() => {
    if (isComplete) return;

    const container = bottomRef.current?.closest('.overflow-y-auto') as HTMLElement | null;
    if (!container) return;

    const blockScroll = (e: Event) => e.preventDefault();
    const blockScrollKeys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Não interfere na digitação/histórico de comandos do input do terminal
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', blockScroll, { passive: false });
    container.addEventListener('touchmove', blockScroll, { passive: false });
    container.addEventListener('keydown', blockScrollKeys);

    return () => {
      container.removeEventListener('wheel', blockScroll);
      container.removeEventListener('touchmove', blockScroll);
      container.removeEventListener('keydown', blockScrollKeys);
    };
  }, [isComplete]);

  const activeLineIndex = displayedLines.findIndex((line, i) => line.length < (lines[i]?.length || 0));
  const cursorIndex = activeLineIndex === -1 ? displayedLines.length - 1 : activeLineIndex;

  return (
    <div className={`flex flex-col ${className}`}>
      {displayedLines.map((line, index) => (
        <div key={index} className="min-h-[1.5em] whitespace-pre-wrap">
          {renderLine ? renderLine(line, index) : line}
          {index === cursorIndex && !isComplete && (
             <span className={cursorClassName}>█</span>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
