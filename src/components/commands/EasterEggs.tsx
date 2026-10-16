import React, { useState, useEffect } from 'react';
import TypewriterText from '../ui/TypewriterText';
import GlitchText from '../ui/GlitchText';

export const Sudo = () => {
  const [showFlash, setShowFlash] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowFlash(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showFlash && (
        <div className="fixed inset-0 bg-[#ff0000] opacity-20 z-[9999] pointer-events-none transition-opacity duration-300"></div>
      )}
      <div className="terminal-line font-bold mt-1">
        <GlitchText
          as="div"
          text="[ERRO] Acesso negado. Este incidente será reportado."
          intensity="intense"
          className="text-term-red bg-[#330000] px-2 py-1 border border-term-red inline-block"
        />
      </div>
    </>
  );
};

const RobotDance = () => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 300);
    return () => clearInterval(timer);
  }, []);

  const frames = [
    " d[o_o]b ",
    " q[o_o]p ",
    " d[-_-]b ",
    " q[-_-]p "
  ];

  return <span className="text-term-cyan font-bold ml-1 inline-block whitespace-pre">{frames[frame]}</span>;
};

export const Hack = () => {
  const lines = [
    "Iniciando invasão na mainframe...",
    "Bypass de firewall em andamento...",
    "[====================] 100%",
    "Acesso de nível root concedido.",
    "...",
    "Brincadeira! A segurança aqui é boa demais.[ROBOT]"
  ];

  const renderLine = (line: string) => {
    if (line.endsWith('[ROBOT]')) {
      return (
        <span className="flex items-center">
          {line.replace('[ROBOT]', '')} <RobotDance />
        </span>
      );
    }
    return line;
  };
  
  return (
    <div className="terminal-line text-term-green">
      <TypewriterText lines={lines} lineDelay={500} baseSpeed={30} renderLine={renderLine} />
    </div>
  );
};

export const Coffee = () => {
  const coffeeArt = `      )  (
     (   ) )
      ) ( (
    _______)_
 .-'---------|  
( C|/\\/\\/\\/\\/|
 '-./\\/\\/\\/\\/|
   '_________'
    '-------'`;
  
  const lines = [
    coffeeArt,
    "",
    "Convertendo café em código desde sempre..."
  ];
  
  return (
    <div className="terminal-line text-term-muted font-mono">
      <TypewriterText lines={lines} baseSpeed={5} lineDelay={200} />
    </div>
  );
};

export const Neofetch = () => {
  const logo = `   MMM      MMM
   MMMM    MMMM
   MMMMM  MMMMM
   MM  MMMM  MM
   MM   MM   MM
   MM        MM`;

  return (
    <div className="terminal-line flex flex-col sm:flex-row gap-4 sm:gap-6 font-mono text-xs sm:text-sm mt-2">
      <div className="text-term-cyan font-bold whitespace-pre leading-tight hidden sm:block">
        {logo}
      </div>
      <div className="flex flex-col justify-center w-full max-w-sm">
        <div className="text-term-cyan font-bold mb-1">marlon@batalha-os</div>
        <div className="border-b border-term-line-strong mb-2 w-full"></div>
        <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1">
            <span className="text-term-cyan font-bold">OS:</span> <span className="text-term-text">Web Portfolio 1.0</span>
            <span className="text-term-cyan font-bold">Host:</span> <span className="text-term-text">Browser</span>
            <span className="text-term-cyan font-bold">Kernel:</span> <span className="text-term-text">React 19</span>
            <span className="text-term-cyan font-bold">Uptime:</span> <span className="text-term-text">∞</span>
            <span className="text-term-cyan font-bold">Packages:</span> <span className="text-term-text">999 (npm)</span>
            <span className="text-term-cyan font-bold">Shell:</span> <span className="text-term-text">bash</span>
            <span className="text-term-cyan font-bold">Resolution:</span> <span className="text-term-text">Responsive</span>
            <span className="text-term-cyan font-bold">DE:</span> <span className="text-term-text">Next.js</span>
            <span className="text-term-cyan font-bold">WM:</span> <span className="text-term-text">Tailwind CSS</span>
        </div>
        <div className="mt-3 flex gap-1.5">
          <div className="w-4 h-4 bg-term-panel"></div>
          <div className="w-4 h-4 bg-term-red"></div>
          <div className="w-4 h-4 bg-term-green"></div>
          <div className="w-4 h-4 bg-term-yellow"></div>
          <div className="w-4 h-4 bg-term-cyan"></div>
          <div className="w-4 h-4 bg-term-muted"></div>
          <div className="w-4 h-4 bg-term-text"></div>
        </div>
      </div>
    </div>
  );
};
