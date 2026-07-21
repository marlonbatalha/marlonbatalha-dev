import React, { useState, useEffect } from 'react';

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export const TerminalSpinner = ({ text = "ENVIANDO" }: { text?: string }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-[#a78bfa] font-mono flex gap-2 items-center my-2 terminal-line">
      <span className="text-[#00ff88]">{SPINNER_FRAMES[frameIndex]}</span>
      <span>[ {text}... ]</span>
    </div>
  );
};
