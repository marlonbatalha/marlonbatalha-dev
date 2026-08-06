import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TypewriterText from '../TypewriterText';

const LINKS = [
  { label: 'Email', value: 'contato@marlonbatalha.dev', href: 'mailto:contato@marlonbatalha.dev', color: 'text-[#00ff88]', external: false },
  { label: 'LinkedIn', value: 'linkedin.com/in/marlonbatalha', href: 'https://linkedin.com/in/marlonbatalha', color: 'text-[#36a3d9]', external: true },
  { label: 'GitHub', value: 'github.com/marlonbatalha', href: 'https://github.com/marlonbatalha', color: 'text-[#e8e8e8]', external: true },
];

export default function Contact() {
  const { t } = useLanguage();

  const intro = t(
    'Sinta-se à vontade para me mandar um e-mail ou conectar nas redes sociais.',
    'Feel free to send me an email or connect on social media.'
  );

  const lines = [
    t('Informações de Contato:', 'Contact Information:'),
    '',
    intro,
    '',
    ...LINKS.map((l) => `${l.label}: ${l.value}`),
  ];

  const renderLine = (line: string, index: number) => {
    if (index === 0) {
      return <span className="text-[#00cfff] font-bold">{line}</span>;
    }
    if (index === 2) {
      return <span className="text-sm text-[#666]">{line}</span>;
    }

    const link = LINKS[index - 4];
    if (link) {
      const prefix = `${link.label}: `;
      const typedValue = line.length > prefix.length ? line.slice(prefix.length) : '';
      return (
        <span className="flex items-center gap-3 text-sm">
          <span className="text-[#a78bfa] w-16 text-right shrink-0">{link.label}:</span>
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
    }

    return line;
  };

  return (
    <div className="flex flex-col gap-2 max-w-xl text-[#e8e8e8] terminal-line">
      <TypewriterText lines={lines} renderLine={renderLine} lineDelay={120} />
    </div>
  );
}
