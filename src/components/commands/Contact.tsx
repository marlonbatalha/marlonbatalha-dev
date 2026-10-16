import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TypewriterText from '../ui/TypewriterText';

/**
 * Formas de contato exibidas pelo comando `contato`, na ordem da lista.
 * `value` é o texto mostrado, `href` o destino do clique, `color` a classe
 * Tailwind do texto e `external` abre em nova aba.
 */
const LINKS = [
  { label: 'Email', value: 'marlonbatalha45@gmail.com', href: 'mailto:marlonbatalha45@gmail.com', color: 'text-term-green', external: false },
  { label: 'LinkedIn', value: 'linkedin.com/in/marlon-batalha-3323a724b', href: 'https://www.linkedin.com/in/marlon-batalha-3323a724b', color: 'text-term-link', external: true },
  { label: 'GitHub', value: 'github.com/marlonbatalha', href: 'https://github.com/marlonbatalha', color: 'text-term-text', external: true },
];

/**
 * Papel de cada linha da saída de `contato` (`meta[i]` descreve `lines[i]`;
 * mesmo padrão de `Projects.tsx`).
 *
 * - `header`: título da seção.
 * - `intro`: frase de introdução.
 * - `spacer`: linha em branco.
 * - `link`: um item de `LINKS`, renderizado como link clicável.
 */
type LineMeta =
  | { type: 'header' }
  | { type: 'intro' }
  | { type: 'spacer' }
  | { type: 'link'; link: typeof LINKS[number] };

export default function Contact() {
  const { t } = useLanguage();

  const intro = t(
    'Sinta-se à vontade para me mandar um e-mail ou conectar nas redes sociais.',
    'Feel free to send me an email or connect on social media.'
  );

  // Mesmo padrão de `lines` + `meta` do Projects.tsx: cada linha carrega seu
  // próprio tipo, em vez de inferir o papel de uma linha por um índice mágico
  // (ex.: `LINKS[index - 4]`) que quebra silenciosamente se alguém adicionar
  // ou remover uma linha do prefixo fixo.
  const lines: string[] = [];
  const meta: LineMeta[] = [];

  lines.push(t('Informações de Contato:', 'Contact Information:'));
  meta.push({ type: 'header' });

  lines.push('');
  meta.push({ type: 'spacer' });

  lines.push(intro);
  meta.push({ type: 'intro' });

  lines.push('');
  meta.push({ type: 'spacer' });

  LINKS.forEach((link) => {
    lines.push(`${link.label}: ${link.value}`);
    meta.push({ type: 'link', link });
  });

  const renderLine = (line: string, index: number) => {
    const m = meta[index];
    if (!m) return line;

    if (m.type === 'header') {
      return <span className="text-term-cyan font-bold">{line}</span>;
    }
    if (m.type === 'intro') {
      return <span className="text-sm text-term-dim">{line}</span>;
    }
    if (m.type === 'spacer') return line;

    // m.type === 'link' — rótulo e valor digitam juntos, caractere a
    // caractere, em vez do rótulo aparecer pronto de uma vez.
    const { link } = m;
    const labelText = `${link.label}:`;
    const prefix = `${labelText} `;
    const visibleLabel = labelText.slice(0, line.length);
    const typedValue = line.length > prefix.length ? line.slice(prefix.length) : '';
    return (
      <span className="flex items-center gap-3 text-sm">
        <span className="text-term-muted w-20 text-right shrink-0">{visibleLabel}</span>
        <a
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className={`${link.color} hover:underline`}
        >
          {typedValue}
        </a>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-2 max-w-xl text-term-text terminal-line">
      <TypewriterText lines={lines} renderLine={renderLine} lineDelay={120} />
    </div>
  );
}
