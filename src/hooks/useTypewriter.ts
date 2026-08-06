import { useState, useEffect, useRef } from 'react';

export interface UseTypewriterOptions {
  lines: string[];
  baseSpeed?: number;
  humanVariance?: number;
  lineDelay?: number;
  startDelay?: number;
  punctuationDelay?: number;
  onComplete?: () => void;
  skip?: boolean;
}

const PUNCTUATION = new Set(['.', ',', ':', '!', '?']);

export function useTypewriter({
  lines,
  baseSpeed = 30,
  humanVariance = 15,
  lineDelay = 200,
  startDelay = 150,
  punctuationDelay = 100,
  onComplete,
  skip = false
}: UseTypewriterOptions) {
  const [displayedLines, setDisplayedLines] = useState<string[]>(() => (skip ? [...lines] : []));
  const [isTyping, setIsTyping] = useState(!skip);
  const [isComplete, setIsComplete] = useState(skip);

  // A ref to keep track of the latest callbacks to avoid dependency cycles in useEffect
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (skip) {
      setDisplayedLines([...lines]);
      setIsTyping(false);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    if (!lines || lines.length === 0) {
      setDisplayedLines([]);
      setIsTyping(false);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    let cancelled = false;
    let rafId = 0;

    // Buffer mutável local — evita depender do estado do React entre frames
    // (fecho antigo) e faz no máximo um setState por frame, em vez de um
    // setTimeout + setState por caractere.
    const buffer = lines.map(() => '');
    let lineIndex = 0;
    let charIndex = 0;
    let nextCharAt: number | null = null; // timestamp no relógio do rAF

    setDisplayedLines(buffer.slice());
    setIsComplete(false);
    setIsTyping(false);

    const delayForNextChar = (prevChar: string | undefined) => {
      const jitter = baseSpeed + (Math.random() * humanVariance * 2 - humanVariance);
      const punctuation = prevChar && PUNCTUATION.has(prevChar) ? punctuationDelay : 0;
      return Math.max(jitter + punctuation, 0);
    };

    const finish = () => {
      setIsTyping(false);
      setIsComplete(true);
      onCompleteRef.current?.();
    };

    const tick = (now: number) => {
      if (cancelled) return;
      if (nextCharAt === null) nextCharAt = now;

      let changed = false;

      // Revela todos os caracteres cujo prazo já venceu neste frame — se a aba
      // ficar em background e "atrasar", isso recupera de uma vez em vez de
      // empilhar timers, que era a causa do drift/engasgo do modelo anterior.
      while (now >= nextCharAt) {
        const currentLine = lines[lineIndex];

        if (charIndex >= currentLine.length) {
          if (lineIndex >= lines.length - 1) {
            if (changed) setDisplayedLines(buffer.slice());
            finish();
            return;
          }
          lineIndex += 1;
          charIndex = 0;
          nextCharAt += lineDelay;
          continue;
        }

        charIndex += 1;
        buffer[lineIndex] = currentLine.slice(0, charIndex);
        changed = true;
        nextCharAt += delayForNextChar(currentLine[charIndex - 1]);
      }

      if (changed) setDisplayedLines(buffer.slice());
      rafId = requestAnimationFrame(tick);
    };

    const startTimeoutId = setTimeout(() => {
      if (cancelled) return;
      setIsTyping(true);
      rafId = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(startTimeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  // Propositalmente não reinicia se `lines` mudar de referência sem `skip`
  // mudar — este hook assume uma montagem por saída de comando.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  return {
    displayedLines,
    isTyping,
    isComplete
  };
}
