import React from 'react';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';
import Whoami from './whoami';
import Ls from './ls';

export const getAvailableCommands = (lang: 'pt' | 'en') => {
  if (lang === 'pt') return ['ajuda', 'sobre', 'projetos', 'habilidades', 'contato', 'whoami', 'ls', 'limpar'];
  return ['help', 'about', 'projects', 'skills', 'contact', 'whoami', 'ls', 'clear'];
};

import { useLanguage } from '@/context/LanguageContext';
import TypewriterText from '../TypewriterText';
import { Sudo, Hack, Coffee, Neofetch } from './EasterEggs';

const Help = () => {
    const { t } = useLanguage();
    
    const lines = [
        t('Comandos disponíveis:', 'Available commands:'),
        '',
        `${t('sobre', 'about').padEnd(12)} - ${t('Saiba mais sobre mim', 'Learn more about me')}`,
        `${t('projetos', 'projects').padEnd(12)} - ${t('Veja meus projetos', 'See my projects')}`,
        `${t('habilidades', 'skills').padEnd(12)} - ${t('Minhas habilidades técnicas', 'My technical skills')}`,
        `${t('contato', 'contact').padEnd(12)} - ${t('Formas de me encontrar', 'Ways to find me')}`,
        `whoami       - ${t('Resumo rápido', 'Quick summary')}`,
        `ls           - ${t('Lista diretórios', 'List directories')}`,
        `clear        - ${t('Limpa o terminal', 'Clear the terminal')}`
    ];

    const renderLine = (line: string, index: number) => {
        const fullLine = lines[index];
        if (index === 0) {
            return <span className="text-[#00cfff] font-bold">{line}</span>;
        }
        if (index > 1 && fullLine.trim() !== '') {
            const separatorIndex = fullLine.indexOf(' - ');
            if (separatorIndex !== -1) {
                const cmdPart = line.substring(0, separatorIndex);
                const descPart = line.substring(separatorIndex);
                return (
                    <span className="ml-2">
                        <span className="text-[#00ff88]">{cmdPart}</span>{descPart}
                    </span>
                );
            }
        }
        return line;
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
