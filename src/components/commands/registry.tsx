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

export const commandRegistry: Record<string, (lang: 'pt' | 'en') => React.ReactNode> = {
    // Help command
    help: (lang) => (
        <div className="terminal-line text-[#e8e8e8]">
            <div className="text-[#00cfff] font-bold mb-2">
                {lang === 'pt' ? 'Comandos disponíveis:' : 'Available commands:'}
            </div>
            <ul className="flex flex-col gap-1 ml-2">
                <li><span className="text-[#00ff88]">{lang === 'pt' ? 'sobre' : 'about'}</span>    - {lang === 'pt' ? 'Saiba mais sobre mim' : 'Learn more about me'}</li>
                <li><span className="text-[#00ff88]">{lang === 'pt' ? 'projetos' : 'projects'}</span> - {lang === 'pt' ? 'Veja meus projetos' : 'See my projects'}</li>
                <li><span className="text-[#00ff88]">{lang === 'pt' ? 'habilidades' : 'skills'}</span>   - {lang === 'pt' ? 'Minhas habilidades técnicas' : 'My technical skills'}</li>
                <li><span className="text-[#00ff88]">{lang === 'pt' ? 'contato' : 'contact'}</span>  - {lang === 'pt' ? 'Formas de me encontrar' : 'Ways to find me'}</li>
                <li><span className="text-[#00ff88]">whoami</span>   - {lang === 'pt' ? 'Resumo rápido' : 'Quick summary'}</li>
                <li><span className="text-[#00ff88]">ls</span>       - {lang === 'pt' ? 'Lista diretórios' : 'List directories'}</li>
                <li><span className="text-[#00ff88]">clear</span>    - {lang === 'pt' ? 'Limpa o terminal' : 'Clear the terminal'}</li>
            </ul>
        </div>
    ),
    ajuda: (lang) => commandRegistry['help'](lang),

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
};
