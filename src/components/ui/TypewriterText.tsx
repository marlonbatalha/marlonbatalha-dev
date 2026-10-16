import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTypewriter, UseTypewriterOptions } from '@/hooks/useTypewriter';

/**
 * Props do `TypewriterText`: todas as opções de {@link UseTypewriterOptions}
 * (linhas, velocidades, `skip`...) mais as de apresentação abaixo.
 */
interface TypewriterTextProps extends UseTypewriterOptions {
  /** Classes extras do container (um flex em coluna com uma `div` por linha). */
  className?: string;
  /** Classes do cursor `█` mostrado no fim da linha que está sendo digitada. */
  cursorClassName?: string;
  /**
   * Personaliza como cada linha é desenhada — para colorir partes do texto
   * ou transformar trechos em links.
   *
   * @param line Texto revelado ATÉ AGORA (pode estar pela metade).
   * @param index Posição da linha em `lines` — use para saber o papel da
   *   linha (título, link...), como fazem os arrays `meta` de `Projects`,
   *   `Contact` e do `Help`.
   */
  renderLine?: (line: string, index: number) => React.ReactNode;
}

/**
 * Exibe texto com efeito de digitação, cursor piscando e auto-scroll do
 * terminal. Enquanto digita, bloqueia a rolagem manual do usuário (que
 * brigaria com o auto-scroll) — por isso qualquer tecla ou toque na tela
 * completa o texto na hora. Com `prefers-reduced-motion`, nem anima.
 *
 * @example
 * <TypewriterText lines={[t('Olá!', 'Hello!'), t('Bem-vindo.', 'Welcome.')]} />
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

// No servidor (e na hidratação) assume que pode animar; o valor real do
// navegador entra logo em seguida, sem divergir do HTML do servidor.
const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );

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
  cursorClassName = 'text-term-green animate-pulse',
  renderLine,
}: TypewriterTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Vira `true` quando o usuário pede para pular (tecla/toque) e continua
  // assim — se o texto mudar depois (troca de idioma), aparece completo.
  const [skippedByUser, setSkippedByUser] = useState(false);

  const { displayedLines, isComplete } = useTypewriter({
    lines,
    baseSpeed,
    humanVariance,
    lineDelay,
    startDelay,
    punctuationDelay,
    onComplete,
    skip: skip || skippedByUser || prefersReducedMotion,
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  // Enquanto digita, qualquer tecla ou toque completa o texto na hora.
  // Teclas modificadoras sozinhas (Shift, Ctrl...) não contam, para não
  // pular sem querer ao começar um atalho.
  useEffect(() => {
    if (isComplete) return;

    const skipNow = () => setSkippedByUser(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
      skipNow();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', skipNow);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', skipNow);
    };
  }, [isComplete]);

  // Vira `true` depois da rolagem final da primeira revelação do texto.
  const settledRef = useRef(false);

  // Auto-scroll: acompanha o texto só enquanto ele aparece pela PRIMEIRA vez
  // (resposta a um comando). Depois disso, mudanças de conteúdo — como a
  // troca de idioma, que atualiza todo o histórico — não mexem na rolagem;
  // senão a tela pularia para o fim mesmo com o usuário lendo lá em cima.
  // (Quem estava no fim continua no fim: o `Terminal` cuida disso na troca.)
  // Escreve o scrollTop dentro de um rAF para alinhar com o paint. Não
  // depende de `isTyping`: o "catch-up" do useTypewriter (aba volta do
  // segundo plano) ou o "pular" podem revelar o resto e completar no mesmo
  // render — por isso a última rolagem acontece junto com `isComplete`.
  useEffect(() => {
    if (!bottomRef.current || settledRef.current) return;
    if (isComplete) settledRef.current = true;

    const rafId = requestAnimationFrame(() => {
      const container = bottomRef.current?.closest('.overflow-y-auto');
      if (container) {
        container.scrollTop = container.scrollHeight;
      } else {
        bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [displayedLines, isComplete]);

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
