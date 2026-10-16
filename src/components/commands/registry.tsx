import React from 'react';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';
import Whoami from './Whoami';
import Ls from './ls';

/**
 * Comandos "oficiais" de cada idioma — usados pelo autocompletar (Tab) e
 * pelo bloqueio de idioma do `Terminal`: um comando que está na lista do
 * OUTRO idioma (ex.: `about` com PT ativo) responde "comando não encontrado".
 *
 * Comandos fora das duas listas (easter eggs como `hack`, `coffee`) não são
 * bloqueados e funcionam em qualquer idioma.
 */
export const getAvailableCommands = (lang: Language): string[] => {
  if (lang === 'pt') return ['ajuda', 'sobre', 'projetos', 'habilidades', 'contato', 'whoami', 'ls', 'limpar'];
  return ['help', 'about', 'projects', 'skills', 'contact', 'whoami', 'ls', 'clear'];
};

import { useLanguage, type Language } from '@/context/LanguageContext';
import TypewriterText from '../ui/TypewriterText';
import { Sudo, Hack, Coffee, Neofetch } from './EasterEggs';

/**
 * Papel de cada linha da saída de `ajuda` (`meta[i]` descreve `lines[i]`;
 * mesmo padrão de `Projects.tsx` e `Contact.tsx`).
 *
 * - `header`: título ("Comandos disponíveis:").
 * - `spacer`: linha em branco.
 * - `command`: linha `comando - descrição`. `separatorIndex` é a posição do
 *   ` - ` na string, usada para pintar só o nome do comando de verde.
 */
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
    pushCommand(t('limpar', 'clear'), t('Limpa o terminal', 'Clear the terminal'));

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

/**
 * Mapa `nome do comando → função que gera a saída`. O `Terminal` procura o
 * texto digitado (em minúsculas) aqui; se não achar, tenta só a primeira
 * palavra (ex.: `sudo qualquer-coisa` → `sudo`).
 *
 * Cada comando com tradução aparece duas vezes (PT e EN) apontando para o
 * mesmo componente; o componente usa `useLanguage()` para escolher o texto.
 * `limpar`/`clear` e o fluxo de `contato` são tratados à parte no `Terminal`.
 *
 * Para adicionar um comando: registre aqui, inclua em `getAvailableCommands`
 * (se tiver versão PT/EN) e adicione uma linha no `Help` acima.
 */
export const commandRegistry: Record<string, (lang: Language) => React.ReactNode> = {
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
