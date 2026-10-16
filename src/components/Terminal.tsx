'use client'

import React, { useEffect, useRef, useState } from 'react'
import { commandRegistry, getAvailableCommands } from './commands/registry'
import { TERMINAL_RUN_EVENT } from '@/lib/terminalEvents'
import { TerminalSendingView } from './TerminalSendingView'
import Whoami from './commands/Whoami'
import { useLanguage } from '@/context/LanguageContext'
import { CONTATO_LIMITES, type ContatoFormData } from '@/lib/contato'

/**
 * Um bloco do histórico do terminal: opcionalmente a linha de comando que o
 * usuário digitou e, embaixo, a saída produzida.
 */
type HistoryEntry = {
  /**
   * Id único e crescente, usado como `key` do React. Não usar o índice do
   * array: ao limpar o histórico o React reaproveitaria o componente antigo
   * (com a digitação já concluída) em vez de montar um novo.
   */
  id: number
  /** Texto digitado, exibido após o prompt `~$`. Ausente em saídas "soltas" (ex.: perguntas do contato). */
  cmd?: string
  /**
   * Saída exibida abaixo do comando. Normalmente o componente do comando
   * (ex.: `<About />`), que continua "vivo" no histórico — por isso reage à
   * troca de idioma. `null` quando o comando não gera saída.
   */
  out: React.ReactNode
}

/**
 * Em que modo o input do terminal está — define o que acontece no Enter.
 *
 * - `normal`: executa comandos (`sobre`, `projetos`...).
 * - `contact_name` → `contact_email` → `contact_message`: etapas do fluxo
 *   iniciado pelo comando `contato`; cada Enter guarda um campo e avança.
 * - `contact_submitting`: enviando a mensagem; o input some e a
 *   `TerminalSendingView` é exibida até o envio terminar.
 *
 * `Ctrl+C` e `Ctrl+L` sempre voltam para `normal`.
 */
type InputMode = 'normal' | 'contact_name' | 'contact_email' | 'contact_message' | 'contact_submitting'

const EMPTY_CONTACT_FORM: ContatoFormData = { nome: '', email: '', mensagem: '' }

/**
 * Comandos da barra de toque do celular, como pares [PT, EN]. São só 5 para
 * caberem lado a lado em 375px sem rolagem lateral escondida.
 */
const QUICK_COMMANDS: [string, string][] = [
  ['sobre', 'about'],
  ['projetos', 'projects'],
  ['habilidades', 'skills'],
  ['contato', 'contact'],
  ['ajuda', 'help'],
]

export default function Terminal() {
  const { language, setLanguage, t, mounted } = useLanguage()

  // Contador de ids das entradas do histórico. Usar o índice do array como
  // key (como era antes) faz o React reconciliar a mesma entrada em vez de
  // remontá-la quando `clear`/Ctrl+L zera o histórico para 1 item só — o
  // componente antigo (com seu estado interno de digitação já concluído)
  // acaba sendo reaproveitado em vez de recriado do zero.
  // Começa em 1 porque a entrada inicial abaixo já usa o id 0 — lido apenas
  // em handlers/effects (nunca durante o render), como as regras dos hooks exigem.
  const idCounterRef = useRef(1)
  const nextId = () => idCounterRef.current++

  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: 0, out: <Whoami /> },
  ])
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [cursorPos, setCursorPos] = useState(0)

  const [inputMode, setInputMode] = useState<InputMode>('normal')
  const [contactForm, setContactForm] = useState<ContatoFormData>(EMPTY_CONTACT_FORM)
  
  const inputRef = useRef<HTMLInputElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (bottomRef.current) {
      const container = bottomRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [history, inputMode])

  useEffect(() => {
    if (inputMode !== 'contact_submitting') {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [inputMode])

  async function runCommand(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return
    const lowerCmd = cmd.toLowerCase()
    
    setCommandHistory(prev => [...prev, cmd])
    appendHistory({ cmd: raw, out: null })

    let keyToUse = lowerCmd
    if (!commandRegistry[keyToUse]) {
        keyToUse = lowerCmd.split(' ')[0]
    }

    const isSpecialCommand = keyToUse === 'clear' || keyToUse === 'limpar';

    // Comandos com alias PT/EN (ajuda/help, sobre/about, projetos/projects,
    // habilidades/skills, contato/contact, limpar/clear) só devem ser
    // reconhecidos no idioma selecionado no momento — 'ls' é igual
    // nos dois idiomas (sempre liberado), e os easter eggs (sudo,
    // hack, coffee, neofetch) não têm alias e continuam funcionando em
    // qualquer idioma.
    const isAliasedCommand = getAvailableCommands('pt').includes(keyToUse) || getAvailableCommands('en').includes(keyToUse)
    const isWrongLanguage = isAliasedCommand && !getAvailableCommands(language).includes(keyToUse)

    if ((!commandRegistry[keyToUse] && !isSpecialCommand) || isWrongLanguage) {
      appendHistory({ out: <span className="text-term-red terminal-line">{t(`Comando não encontrado: ${keyToUse}. Digite 'ajuda' para opções.`, `Command not found: ${keyToUse}. Type 'help' for options.`)}</span> })
      return
    }

    if (keyToUse === 'clear' || keyToUse === 'limpar') {
      setHistory([{ id: nextId(), out: <Whoami /> }])
      return
    }

    if (keyToUse === 'contato' || keyToUse === 'contact') {
      const handler = commandRegistry[keyToUse]
      try {
        const result = await handler(language)
        if (result !== null) appendHistory({ out: result })
        
        appendHistory({ out: <div className="text-term-muted font-bold terminal-line mt-4 mb-2">{t('[ INICIANDO MODO DE MENSAGEM DIRETA ]', '[ INITIATING DIRECT MESSAGE MODE ]')}</div> })
        appendHistory({ out: <div className="text-term-text terminal-line"><span className="text-term-green">?</span> {t('Qual é o seu nome:', 'What is your name:')}</div> })
        setInputMode('contact_name')
      } catch (err) {
        appendHistory({ out: <span className="text-term-red terminal-line">{t('Erro ao executar', 'Error executing')}: {(err as Error).message}</span> })
      }
      return
    }

    const handler = commandRegistry[keyToUse]
    // O que vem depois do nome do comando (ex.: `habilidades oracle` → "oracle").
    const args = keyToUse === lowerCmd ? '' : lowerCmd.slice(keyToUse.length).trim()
    try {
      const result = await handler(language, args)
      if (result !== null) appendHistory({ out: result })
    } catch (err) {
      appendHistory({ out: <span className="text-term-red terminal-line">{t('Erro ao executar', 'Error executing')}: {(err as Error).message}</span> })
    }
  }

  function appendHistory(entry: Omit<HistoryEntry, 'id'>) {
    setHistory((h) => [...h.filter(Boolean), { ...entry, id: nextId() }])
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() && inputMode === 'normal') return
    
    const cmd = input.trim()

    // Mesmos limites da API — avisa já na etapa, em vez de só falhar no envio
    const tooLong = (max: number) => {
      if (cmd.length <= max) return false
      appendHistory({ out: <div className="text-term-red terminal-line">{t(`Texto muito longo (máx. ${max} caracteres). Tente novamente.`, `Text too long (max ${max} characters). Try again.`)}</div> })
      return true
    }

    if (inputMode === 'contact_name') {
      if (!cmd || tooLong(CONTATO_LIMITES.nome)) return;
      setContactForm(prev => ({ ...prev, nome: cmd }))
      appendHistory({ out: <div className="text-term-text terminal-line"><span className="text-term-green">?</span> {t('Qual é o seu nome:', 'What is your name:')} <span className="text-term-cyan">{cmd}</span></div> })
      appendHistory({ out: <div className="text-term-text terminal-line mt-2"><span className="text-term-green">?</span> {t('Qual é o seu email:', 'What is your email:')}</div> })
      setInputMode('contact_email')
      setInput('')
      return
    }

    if (inputMode === 'contact_email') {
      if (!cmd || !cmd.includes('@')) {
        appendHistory({ out: <div className="text-term-red terminal-line">{t('Email inválido. Tente novamente.', 'Invalid email. Try again.')}</div> })
        return;
      }
      if (tooLong(CONTATO_LIMITES.email)) return;
      setContactForm(prev => ({ ...prev, email: cmd }))
      appendHistory({ out: <div className="text-term-text terminal-line"><span className="text-term-green">?</span> {t('Qual é o seu email:', 'What is your email:')} <span className="text-term-cyan">{cmd}</span></div> })
      appendHistory({ out: <div className="text-term-text terminal-line mt-2"><span className="text-term-green">?</span> {t('Digite sua mensagem:', 'Enter your message:')}</div> })
      setInputMode('contact_message')
      setInput('')
      return
    }

    if (inputMode === 'contact_message') {
      if (!cmd || tooLong(CONTATO_LIMITES.mensagem)) return;
      appendHistory({ out: <div className="text-term-text terminal-line"><span className="text-term-green">?</span> {t('Mensagem:', 'Message:')} <span className="text-term-cyan">{cmd}</span></div> })
      
      setContactForm(prev => ({ ...prev, mensagem: cmd }))
      setInputMode('contact_submitting')
      setInput('')
      return
    }

    runCommand(input)
    setInput('')
    setHistoryIndex(-1)
    inputRef.current?.focus()
  }

  const handleContactSuccess = (name: string) => {
    appendHistory({ out: <div className="text-term-green terminal-line font-bold mt-2">{t('[ TRANSMISSÃO COMPLETA ]', '[ TRANSMISSION COMPLETE ]')}</div> })
    appendHistory({ out: <div className="text-term-dim terminal-line text-sm mt-1">{t(`Olá ${name}, sua mensagem foi enviada. Responderei em breve.`, `Hello ${name}, your message has been received. I'll reply soon.`)}</div> })
    setInputMode('normal')
    setContactForm(EMPTY_CONTACT_FORM)
  }

  const handleContactError = () => {
    appendHistory({ out: <div className="text-term-red terminal-line mt-2">{t('[✖] Erro ao enviar mensagem. Voltando ao terminal padrão...', '[✖] Error sending message. Returning to default terminal...')}</div> })
    setInputMode('normal')
    setContactForm(EMPTY_CONTACT_FORM)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (inputMode !== 'normal') {
        appendHistory({ out: <div className="text-term-red terminal-line mt-2">{t('[✖] Operação cancelada. Voltando ao terminal padrão...', '[✖] Operation cancelled. Returning to default terminal...')}</div> })
        setInputMode('normal');
        setContactForm(EMPTY_CONTACT_FORM);
        setInput('');
      } else {
        appendHistory({ cmd: input + '^C', out: null });
        setInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([{ id: nextId(), out: <Whoami /> }]);
      if (inputMode !== 'normal') {
        setInputMode('normal');
        setContactForm(EMPTY_CONTACT_FORM);
      }
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const availableCommands = getAvailableCommands(language);
      const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
      
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        appendHistory({ 
          cmd: input, 
          out: <div className="terminal-line text-term-cyan">{matches.join('  ')}</div> 
        });
      }
    }
  }

  // Troca de idioma x rolagem: trocar o idioma atualiza o texto de TODO o
  // histórico, mudando a altura do conteúdo. Quem estava lendo algo lá em
  // cima fica onde está; quem estava no fim (como num terminal real) continua
  // no fim. A posição é medida no pointerdown — antes de qualquer conteúdo
  // mudar (inclusive o "pular digitação", que também reage ao toque).
  const wasAtBottomRef = useRef(false)

  const rememberIfAtBottom = () => {
    const container = bottomRef.current?.parentElement
    if (!container) return
    // Folga de ~2 linhas: durante a digitação o texto pode ter crescido um
    // pouco desde o último auto-scroll.
    wasAtBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < 48
  }

  const keepAtBottomAfterLanguageChange = () => {
    if (!wasAtBottomRef.current) return
    wasAtBottomRef.current = false
    // Espera os textos trocarem de idioma (cada TypewriterText atualiza no
    // próprio efeito, um render depois) antes de rolar até o fim.
    setTimeout(() => {
      const container = bottomRef.current?.parentElement
      if (container) container.scrollTop = container.scrollHeight
    }, 50)
  }

  // Botões de comando do celular: executa como se tivesse digitado, mas sem
  // focar o input (o que abriria o teclado e cobriria metade da tela).
  const runQuickCommand = (cmd: string) => {
    if (inputMode !== 'normal') return
    runCommand(cmd)
    setInput('')
    setHistoryIndex(-1)
  }

  // Saídas de comandos podem pedir para executar outro comando (ex.: clicar
  // numa tecnologia em `habilidades`) disparando `runTerminalCommand()`.
  // O ref aponta sempre para a versão atual da função (com o idioma e o
  // modo de input atuais), sem precisar re-registrar o listener.
  const runQuickCommandRef = useRef(runQuickCommand)
  useEffect(() => {
    runQuickCommandRef.current = runQuickCommand
  })
  useEffect(() => {
    const onRun = (e: Event) => runQuickCommandRef.current((e as CustomEvent<string>).detail)
    window.addEventListener(TERMINAL_RUN_EVENT, onRun)
    return () => window.removeEventListener(TERMINAL_RUN_EVENT, onRun)
  }, [])

  const handleTerminalClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 640) {
      return;
    }
    if (window.getSelection()?.toString() === '') {
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex-1 w-full flex items-center justify-center sm:p-4 md:p-8" role="application" aria-label="Terminal do portfólio">
      <div 
        className={`w-full max-w-4xl h-[100dvh] sm:h-[85vh] max-h-none sm:max-h-[800px] bg-term-window sm:rounded-xl border-y sm:border border-term-line shadow-none sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out relative crt-overlay ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleTerminalClick}
      >
        
        <div className="h-10 border-b border-term-line flex items-center px-4 relative bg-term-titlebar shrink-0">
          <div className="flex gap-2 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-dot-red"></div>
            <div className="w-3 h-3 rounded-full bg-dot-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-dot-green"></div>
          </div>
          <div className="w-full text-center text-term-subtle text-xs font-semibold tracking-wide">
            marlonbatalha@portfolio — bash
          </div>
        </div>

        <div className="h-8 border-b border-term-line flex items-center justify-between px-4 text-xs text-term-dim bg-term-panel uppercase tracking-wider shrink-0">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dot-green animate-pulse"></span>
              online
            </div>
            <span>bash 5.2.0</span>
            <span>UTF-8</span>
          </div>
          
          <button
            type="button"
            aria-label={t('Mudar idioma para inglês', 'Switch language to Portuguese')}
            className="flex items-center gap-2 font-bold cursor-pointer uppercase tracking-wider z-50"
            onPointerDown={rememberIfAtBottom}
            onClick={(e) => {
              e.stopPropagation();
              setLanguage(language === 'pt' ? 'en' : 'pt');
              keepAtBottomAfterLanguageChange();
            }}
          >
            <span className={language === 'pt' ? 'text-term-cyan' : 'text-term-faint'}>BR</span>
            <span className="text-term-line-strong">/</span>
            <span className={language === 'en' ? 'text-term-cyan' : 'text-term-faint'}>EN</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 text-term-text" onClick={handleTerminalClick} aria-live="polite">
          <div className="flex flex-col gap-4 mb-4">
            {history.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-1.5">
                {entry.cmd && (
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-sm md:text-base terminal-line">
                    <div className="flex items-center">
                      <span className="text-term-green font-bold drop-shadow-[0_0_5px_rgba(0,255,136,0.4)] hidden sm:inline">marlonbatalha</span>
                      <span className="text-term-dim hidden sm:inline">@</span>
                      <span className="text-term-cyan font-bold drop-shadow-[0_0_5px_rgba(0,207,255,0.4)] hidden sm:inline">portfolio</span>
                      <span className="text-term-dim hidden sm:inline">:</span>
                      <span className="font-bold text-term-green sm:text-term-muted">~</span>
                      <span className="text-term-dim">$</span>
                    </div>
                    <span className="text-term-text">{entry.cmd}</span>
                  </div>
                )}
                <div className="pl-0 leading-relaxed text-sm md:text-base">{entry.out}</div>
              </div>
            ))}
          </div>

          {inputMode === 'contact_submitting' ? (
            <TerminalSendingView 
              formData={contactForm} 
              onSuccess={() => handleContactSuccess(contactForm.nome)} 
              onError={handleContactError} 
            />
          ) : (
            <form onSubmit={onSubmit} className="flex items-center gap-1.5 sm:gap-2 mt-2 text-sm md:text-base z-10 relative terminal-line">
              <div className="flex items-center shrink-0">
                {inputMode === 'normal' ? (
                  <>
                    <span className="text-term-green font-bold drop-shadow-[0_0_5px_rgba(0,255,136,0.4)] hidden sm:inline">marlonbatalha</span>
                    <span className="text-term-dim hidden sm:inline">@</span>
                    <span className="text-term-cyan font-bold drop-shadow-[0_0_5px_rgba(0,207,255,0.4)] hidden sm:inline">portfolio</span>
                    <span className="text-term-dim hidden sm:inline">:</span>
                    <span className="font-bold text-term-green sm:text-term-muted">~</span>
                    <span className="text-term-dim">$</span>
                  </>
                ) : (
                  <span className="text-term-green font-bold">{'>'}</span>
                )}
              </div>
              <div className="relative flex-1 flex items-center h-full min-h-[1.5em] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none flex items-center whitespace-pre text-term-text">
                  <span>{input.slice(0, cursorPos)}</span>
                  <span className="text-black bg-term-green animate-[pulse_1s_steps(2,start)_infinite] inline-flex justify-center items-center min-w-[0.6em] h-[1.2em]">
                    {input.slice(cursorPos, cursorPos + 1) || ' '}
                  </span>
                  <span>{input.slice(cursorPos + 1)}</span>
                </div>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setCursorPos(e.target.selectionStart || 0);
                  }}
                  onSelect={(e) => setCursorPos(e.currentTarget.selectionStart || 0)}
                  onKeyUp={(e) => setCursorPos(e.currentTarget.selectionStart || 0)}
                  onClick={(e) => setCursorPos(e.currentTarget.selectionStart || 0)}
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                    // Defer cursor update to let React process the history navigation
                    setTimeout(() => setCursorPos(inputRef.current?.selectionStart || input.length), 10);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Entrada de comando"
                />
              </div>
            </form>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Mouse/teclado: dicas de atalho. */}
        <div className="h-10 border-t border-term-line flex pointer-coarse:hidden items-center px-4 gap-4 md:gap-6 text-xs text-term-faint bg-term-panel shrink-0 overflow-x-auto scrollbar-hide whitespace-nowrap">
          <div className="flex items-center gap-2"><span className="border border-term-line-strong px-1.5 py-0.5 rounded text-term-subtle">↑↓</span> {t('histórico', 'history')}</div>
          <div className="flex items-center gap-2"><span className="border border-term-line-strong px-1.5 py-0.5 rounded text-term-subtle">Tab</span> {t('completar', 'autocomplete')}</div>
          <div className="hidden md:flex items-center gap-2"><span className="border border-term-line-strong px-1.5 py-0.5 rounded text-term-subtle">Ctrl+L</span> {t('limpar', 'clear')}</div>
          <div className="flex items-center gap-2"><span className="border border-term-line-strong px-1.5 py-0.5 rounded text-term-subtle">Enter</span> {t('executar', 'execute')}</div>
        </div>

        {/* Toque: atalhos de teclado não existem no celular — no lugar deles,
            os comandos principais para tocar e executar direto. */}
        <nav
          aria-label={t('Comandos rápidos', 'Quick commands')}
          className="hidden pointer-coarse:flex h-12 border-t border-term-line items-stretch px-1 text-xs bg-term-panel shrink-0 whitespace-nowrap"
        >
          {QUICK_COMMANDS.map(([pt, en]) => {
            const cmd = t(pt, en)
            return (
              <button
                key={pt}
                type="button"
                disabled={inputMode !== 'normal'}
                onClick={() => runQuickCommand(cmd)}
                className="flex-1 px-1 text-term-green disabled:text-term-faint"
              >
                {cmd}
              </button>
            )
          })}
        </nav>

      </div>
    </div>
  )
}