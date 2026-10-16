import { useState, useEffect, useRef } from 'react';

/**
 * Opções do efeito de digitação. Todos os tempos são em milissegundos.
 *
 * O texto é revelado caractere a caractere, com um pequeno atraso aleatório
 * entre eles para parecer digitação humana.
 */
export interface UseTypewriterOptions {
  /**
   * Linhas a digitar, em ordem. Cada string vira uma linha na tela.
   * Se o CONTEÚDO mudar (ex.: troca de idioma), a digitação recomeça do zero;
   * um novo array com o mesmo texto não reinicia nada.
   */
  lines: string[];
  /** Atraso médio entre caracteres. Padrão: `30`. */
  baseSpeed?: number;
  /** Variação aleatória (±) somada ao `baseSpeed` em cada caractere. Padrão: `15`. */
  humanVariance?: number;
  /** Pausa ao terminar uma linha, antes de começar a próxima. Padrão: `200`. */
  lineDelay?: number;
  /** Espera antes do primeiro caractere (simula o comando "processando"). Padrão: `150`. */
  startDelay?: number;
  /** Pausa extra depois de `.` `,` `:` `!` `?`. Padrão: `100`. */
  punctuationDelay?: number;
  /** Chamado uma vez, quando todas as linhas foram digitadas. */
  onComplete?: () => void;
  /** Se `true`, mostra o texto completo na hora, sem animação. Padrão: `false`. */
  skip?: boolean;
}

const PUNCTUATION = new Set(['.', ',', ':', '!', '?']);
// Piso mínimo entre caracteres — sem isso, um `baseSpeed` <= `humanVariance`
// (nenhum call site atual faz isso, mas é uma configuração válida da API)
// pode zerar o delay e fazer o loop do tick() revelar o texto inteiro de
// forma síncrona num único frame, em vez de animar.
const MIN_CHAR_DELAY = 4;

/**
 * Anima `lines` como se estivessem sendo digitadas.
 *
 * @returns
 * - `displayedLines`: o texto revelado até agora, uma string por linha
 *   (mesmo tamanho de `lines`; linhas ainda não alcançadas vêm vazias).
 * - `isTyping`: `true` enquanto há caracteres sendo revelados.
 * - `isComplete`: `true` quando tudo foi digitado (ou `skip` está ativo).
 *
 * Normalmente não é usado direto — veja o componente `TypewriterText`.
 */
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

  // Chave baseada no texto real das linhas (não na referência do array, que
  // é recriada a cada render) — usada para saber se `lines` mudou de fato.
  const linesKey = lines.join(' ');

  // A ref to keep track of the latest callbacks to avoid dependency cycles in useEffect
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // `true` depois que o texto foi revelado por completo uma vez. A partir daí,
  // se `lines` mudar (troca de idioma), o texto novo aparece na hora — sem
  // redigitar o histórico inteiro, o que travaria a rolagem e puxaria a tela
  // para o fim a cada troca.
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (hasCompletedRef.current) {
      setDisplayedLines([...lines]);
      setIsTyping(false);
      setIsComplete(true);
      return;
    }

    if (skip) {
      setDisplayedLines([...lines]);
      setIsTyping(false);
      setIsComplete(true);
      // onComplete é adiado e ligado a um cleanup por causa do StrictMode do
      // React em dev: ele monta/limpa/monta o efeito de novo de propósito, e
      // uma chamada síncrona aqui dispararia onComplete duas vezes para uma
      // única montagem lógica. Adiando com setTimeout(0), a limpeza do
      // primeiro disparo (síncrona, antes do timer estourar) cancela a
      // chamada obsoleta, sobrando só a da segunda montagem.
      let cancelled = false;
      const id = setTimeout(() => {
        if (cancelled) return;
        // Marcado aqui (e não de forma síncrona) por causa do StrictMode: a
        // segunda execução do efeito precisa repetir este ramo e agendar o
        // onComplete de novo, já que o da primeira foi cancelado.
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(id);
      };
    }

    if (!lines || lines.length === 0) {
      setDisplayedLines([]);
      setIsTyping(false);
      setIsComplete(true);
      let cancelled = false;
      const id = setTimeout(() => {
        if (cancelled) return;
        hasCompletedRef.current = true; // ver comentário no ramo `skip`
        onCompleteRef.current?.();
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(id);
      };
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
      return Math.max(jitter + punctuation, MIN_CHAR_DELAY);
    };

    const finish = () => {
      hasCompletedRef.current = true;
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
  // Reinicia quando o CONTEÚDO de `lines` muda de verdade (ex.: troca de
  // idioma), não quando só a referência do array muda — `linesKey` compara
  // pelo texto, então re-renders do componente pai (ex.: cada tecla digitada
  // no terminal) não disparam a animação de novo, só uma mudança real.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, linesKey]);

  return {
    displayedLines,
    isTyping,
    isComplete
  };
}
