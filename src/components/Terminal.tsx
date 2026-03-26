// src/components/Terminal.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy-load command components (carrega sob demanda)
const About = dynamic(() => import('./commands/About'))
const Projects = dynamic(() => import('./commands/Projects'))
const Skills = dynamic(() => import('./commands/Skills'))
const Contact = dynamic(() => import('./commands/Contact'))

type HistoryEntry = {
  cmd?: string
  out: React.ReactNode
}

// Definição do componente Terminal e estados de inicio
export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { out: 'Bem-vindo ao meu portfólio — digite "help" para começar.' },
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Registro de comandos: registry pode retornar ReactNode ou uma função que retorna ReactNode
  const registry: Record<string, () => React.ReactNode | Promise<React.ReactNode>> = {
    help: () =>
      'Comandos disponíveis: help, about, projects, skills, contact, clear',
    about: () => <About />,
    projects: () => <Projects />,
    skills: () => <Skills />,
    contact: () => <Contact />,
    clear: () => {
      setHistory([])
      return null
    },
  }

  async function runCommand(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return
    const key = cmd.split(' ')[0].toLowerCase()
    const handler = registry[key]

    // sempre adiciona o comando digitado ao histórico
    appendHistory({ cmd: raw, out: null })

    if (!handler) {
      appendHistory({ out: `Comando não encontrado: ${key}` })
      return
    }

    try {
      const result = await handler()
      // handler pode retornar null (ex.: clear) ou ReactNode
      if (result !== null) appendHistory({ out: result })
    } catch (err) {
      appendHistory({ out: `Erro ao executar: ${(err as Error).message}` })
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
    inputRef.current?.focus()
  }

  return (
    <div className="terminal" role="application" aria-label="Terminal do portfólio">
      <div className="history">
        {history.map((entry, i) => (
          <div key={i} className="entry">
            {entry.cmd ? <div className="prompt">&gt; {entry.cmd}</div> : null}
            <div className="output">{entry.out}</div>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="prompt-form">
        <span className="prompt-label">&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="cmd-input"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  )
}