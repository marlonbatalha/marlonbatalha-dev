import React from 'react';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';
import Whoami from './Whoami';
import Ls from './ls';

export const getAvailableCommands = (lang: 'pt' | 'en') => {
  if (lang === 'pt') return ['ajuda', 'sobre', 'projetos', 'habilidades', 'contato', 'whoami', 'ls', 'limpar'];
  return ['help', 'about', 'projects', 'skills', 'contact', 'whoami', 'ls', 'clear'];
};

import { useLanguage } from '@/context/LanguageContext';
import TypewriterText from '../ui/TypewriterText';
import { Sudo, Hack, Coffee, Neofetch } from './EasterEggs';

// Mesmo padrão de `lines` + `meta` do Projects.tsx/Contact.tsx: cada linha
// carrega seu próprio tipo (header/spacer/command), em vez de re-inferir o
// papel de uma linha a partir de índices/heurísticas de string à parte.
type HelpLineMeta =
    | { type: 'header' }
    | { type: 'spacer' }
    | { type: 'command'; separatorIndex: number };

const Help = () => {
    const { t } = useLanguage();

    const lines: string[] = [];
    const meta: HelpLineMeta[] = [];

    const pushHeader = (text: string) => {
        lines.push(text);
        meta.push({ type: 'header' });
    };
    const pushSpacer = () => {
        lines.push('');
        meta.push({ type: 'spacer' });
    };
    const pushCommand = (cmd: string, desc: string) => {
        const line = `${cmd.padEnd(12)} - ${desc}`;
        lines.push(line);
        meta.push({ type: 'command', separatorIndex: line.indexOf(' - ') });
    };

    pushHeader(t('Comandos disponíveis:', 'Available commands:'));
    pushSpacer();
    pushCommand(t('sobre', 'about'), t('Saiba mais sobre mim', 'Learn more about me'));
    pushCommand(t('projetos', 'projects'), t('Veja meus projetos', 'See my projects'));
    pushCommand(t('habilidades', 'skills'), t('Minhas habilidades técnicas', 'My technical skills'));
    pushCommand(t('contato', 'contact'), t('Formas de me encontrar', 'Ways to find me'));
    pushCommand('whoami', t('Resumo rápido', 'Quick summary'));
    pushCommand('ls', t('Lista diretórios', 'List directories'));
    pushCommand('clear', t('Limpa o terminal', 'Clear the terminal'));

    const renderLine = (line: string, index: number) => {
        const m = meta[index];
        if (!m) return line;

        if (m.type === 'header') {
            return <span className="text-[#00cfff] font-bold">{line}</span>;
        }
        if (m.type === 'spacer') return line;

        // m.type === 'command'
        if (line.length <= m.separatorIndex) {
            return <span className="ml-2 text-[#00ff88]">{line}</span>;
        }
        const cmdPart = line.substring(0, m.separatorIndex);
        const descPart = line.substring(m.separatorIndex);
        return (
            <span className="ml-2">
                <span className="text-[#00ff88]">{cmdPart}</span>{descPart}
            </span>
        );
    };

    return (
        <div className="terminal-line text-[#e8e8e8]">
            <TypewriterText lines={lines} renderLine={renderLine} lineDelay={100} />
        </div>
    );
};

export const commandRegistry: Record<string, (lang: 'pt' | 'en') => React.ReactNode> = {
    // Help command
    help: () => <Help />,
    ajuda: () => <Help />,

    // About
    about: () => <About />,
    sobre: () => <About />,

    // Projects
    projects: () => <Projects />,
    projetos: () => <Projects />,

    // Skills
    skills: () => <Skills />,
    habilidades: () => <Skills />,

    // Contact
    contact: () => <Contact />,
    contato: () => <Contact />,

    // Extras
    whoami: () => <Whoami />,
    ls: () => <Ls />,

    // Easter Eggs (not listed in help)
    sudo: () => <Sudo />,
    'sudo rm -rf /': () => <Sudo />,
    hack: () => <Hack />,
    coffee: () => <Coffee />,
    neofetch: () => <Neofetch />,
};
