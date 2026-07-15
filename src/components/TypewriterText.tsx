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
