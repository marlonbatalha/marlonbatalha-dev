// src/components/Terminal.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { commandRegistry, getAvailableCommands } from './commands/registry'
import { useLanguage } from '@/context/LanguageContext'

type HistoryEntry = {
  cmd?: string
  out: React.ReactNode
}

export default function Terminal() {
  const { language, setLanguage, t, mounted } = useLanguage()

  const [history, setHistory] = useState<HistoryEntry[]>([
    { out: commandRegistry['whoami'](language) },
  ])
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (bottomRef.current) {
      // scrollIntoView might not be as reliable as setting scrollTop on the container
      const container = bottomRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [history])

  async function runCommand(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return
    const key = cmd.split(' ')[0].toLowerCase()
    
    appendHistory({ cmd: raw, out: null })

    // Validação estrita de idioma: só permite o comando se for do idioma atual
    const validCommands = getAvailableCommands(language);
    if (!validCommands.includes(key)) {
      appendHistory({ out: <span className="text-[#ff5f57] terminal-line">{t(`Comando não encontrado: ${key}. Digite 'ajuda' para opções.`, `Command not found: ${key}. Type 'help' for options.`)}</span> })
      return
    }

    // Comandos nativos do terminal que não precisam de registry
    if (key === 'clear' || key === 'limpar') {
      setHistory([])
      return
    }

    const handler = commandRegistry[key]

    try {
      const result = await handler(language)
      if (result !== null) appendHistory({ out: result })
    } catch (err) {
      appendHistory({ out: <span className="text-[#ff5f57] terminal-line">{t('Erro ao executar', 'Error executing')}: {(err as Error).message}</span> })
    }
  }

  function appendHistory(entry: HistoryEntry) {
    setHistory((h) => [...h.filter(Boolean), entry])
  }

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim()) return
    runCommand(input)
    setInput('')
    setHistoryIndex(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const commandsOnly = history.filter(h => h.cmd).map(h => h.cmd as string);

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandsOnly.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandsOnly.length) {
          setHistoryIndex(nextIndex);
          setInput(commandsOnly[commandsOnly.length - 1 - nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandsOnly[commandsOnly.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const availableCommands = getAvailableCommands(language);
      const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
      
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        appendHistory({ 
          cmd: input, 
          out: <div className="terminal-line text-[#00cfff]">{matches.join('  ')}</div> 
        });
      }
    }
  }

  const handleTerminalClick = () => {
    // Only focus if the user hasn't selected text
    if (window.getSelection()?.toString() === '') {
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8" role="application" aria-label="Terminal do portfólio">
      <div 
        className={`w-full max-w-4xl h-[85vh] max-h-[800px] bg-[#0d0d0d] rounded-xl border border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out relative crt-overlay ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleTerminalClick}
      >
        
        <div className="h-10 border-b border-[#222] flex items-center px-4 relative bg-[#18181a] shrink-0">
          <div className="flex gap-2 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="w-full text-center text-[#888] text-xs font-semibold tracking-wide">
            marlonbatalha@portfolio — bash
          </div>
        </div>

        <div className="h-8 border-b border-[#222] flex items-center justify-between px-4 text-[11px] text-[#666] bg-[#111] uppercase tracking-wider shrink-0">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse"></span>
              online
            </div>
            <span>bash 5.2.0</span>
            <span>UTF-8</span>
          </div>
          
          {/* Seletor de Idioma */}
          <div 
            className="flex items-center gap-2 font-bold cursor-pointer hover:text-[#888] transition-colors" 
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          >
            <span className={language === 'pt' ? 'text-[#00cfff]' : 'text-[#444]'}>BR</span>
            <span className="text-[#333]">/</span>
            <span className={language === 'en' ? 'text-[#00cfff]' : 'text-[#444]'}>EN</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 text-[#e8e8e8]" onClick={handleTerminalClick} aria-live="polite">
          <div className="flex flex-col gap-4 mb-4">
            {history.map((entry, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                {entry.cmd && (
                  <div className="flex items-center gap-2 flex-wrap text-sm md:text-base terminal-line">
                    <span className="text-[#00ff88] font-bold drop-shadow-[0_0_5px_rgba(0,255,136,0.4)]">marlonbatalha</span>
                    <span className="text-[#666]">@</span>
                    <span className="text-[#00cfff] font-bold drop-shadow-[0_0_5px_rgba(0,207,255,0.4)]">portfolio</span>
                    <span className="text-[#666]">:</span>
                    <span className="text-[#a78bfa] font-bold">~</span>
                    <span className="text-[#666]">$</span>
                    <span className="text-[#e8e8e8]">{entry.cmd}</span>
                  </div>
                )}
                <div className="pl-0 leading-relaxed text-sm md:text-base">{entry.out}</div>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 mt-4 bg-[#141414] border border-[#2a2a2a] p-2.5 rounded-lg text-sm md:text-base shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10 relative terminal-line transition-all duration-300 focus-within:border-[#333] focus-within:shadow-[0_0_8px_rgba(0,255,136,0.05)]">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[#00ff88] font-bold drop-shadow-[0_0_5px_rgba(0,255,136,0.4)]">marlonbatalha</span>
              <span className="text-[#666]">@</span>
              <span className="text-[#00cfff] font-bold drop-shadow-[0_0_5px_rgba(0,207,255,0.4)]">portfolio</span>
              <span className="text-[#666]">:</span>
              <span className="text-[#a78bfa] font-bold">~</span>
              <span className="text-[#666]">$</span>
            </div>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-[#e8e8e8] caret-[#00ff88]"
              autoComplete="off"
              spellCheck={false}
              aria-label="Entrada de comando"
            />
          </form>
          <div ref={bottomRef} />
        </div>

        <div className="h-10 border-t border-[#222] flex items-center px-4 gap-4 md:gap-6 text-[11px] md:text-xs text-[#555] bg-[#111] shrink-0">
          <div className="flex items-center gap-2"><span className="border border-[#333] px-1.5 py-0.5 rounded text-[#888]">↑↓</span> {t('histórico', 'history')}</div>
          <div className="flex items-center gap-2"><span className="border border-[#333] px-1.5 py-0.5 rounded text-[#888]">Tab</span> {t('completar', 'autocomplete')}</div>
          <div className="flex items-center gap-2 hidden md:flex"><span className="border border-[#333] px-1.5 py-0.5 rounded text-[#888]">Ctrl+L</span> {t('limpar', 'clear')}</div>
          <div className="flex items-center gap-2"><span className="border border-[#333] px-1.5 py-0.5 rounded text-[#888]">Enter</span> {t('executar', 'execute')}</div>
        </div>

      </div>
    </div>
  )
}