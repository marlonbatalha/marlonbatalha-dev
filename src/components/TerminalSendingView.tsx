'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const STEPS = [
  { text: 'Validando campos de entrada...', textEn: 'Validating input fields...', dur: 520 },
  { text: 'Estabelecendo conexão segura...', textEn: 'Establishing secure connection...', dur: 780 },
  { text: 'Cifrando payload...', textEn: 'Encrypting payload...', dur: 560 },
  { text: 'Transmitindo pacotes...', textEn: 'Transmitting packets...', dur: 840 },
  { text: 'Aguardando confirmação do servidor...', textEn: 'Awaiting server confirmation...', dur: 580 },
  { text: 'Confirmação recebida.', textEn: 'Confirmation received.', dur: 0 },
];
const PROGRESS_BAR_WIDTH = 24;

interface ContactFormData {
  nome: string;
  email: string;
  mensagem: string;
}

export function TerminalSendingView({
    formData,
    onSuccess,
    onError
}: {
    formData: ContactFormData,
    onSuccess: () => void,
    onError: () => void
}) {
  const { language } = useLanguage();
  const lang = language as 'pt' | 'en';
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const hasFetched = useRef(false);
  const fetchPromiseRef = useRef<Promise<boolean> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Força o scroll do terminal a cada nova linha adicionada
  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.scrollTop = parent.scrollHeight;
      }
    }
  }, [currentStep]);

  useEffect(() => {
    // Start spinner
    const spinner = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length);
    }, 75);

    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    // Start the fetch exactly once
    if (!hasFetched.current) {
        hasFetched.current = true;
        fetchPromiseRef.current = fetch('/api/contato', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }).then(async (res) => {
            if (!res.ok) {
                const body = await res.json().catch(() => null);
                console.error('[contato] Falha ao enviar (status', res.status + '):', body?.error ?? '(sem detalhe)');
                return false;
            }
            return true;
        }).catch((err) => {
            console.error('[contato] Erro de rede ao enviar formulário:', err);
            return false;
        });
    }

    STEPS.forEach((step, i) => {
      const showDelay = elapsed;
      elapsed += step.dur;

      const showTimer = setTimeout(() => {
        setCurrentStep(i);
        setProgress(Math.round(((i + 1) / STEPS.length) * 100));

        if (i < STEPS.length - 1) {
          const doneTimer = setTimeout(() => {
            setCompletedSteps((prev) => new Set(prev).add(i));
          }, step.dur - 60);
          timers.push(doneTimer);
        } else {
          // Final step
          const successTimer = setTimeout(async () => {
            clearInterval(spinner);
            const ok = await fetchPromiseRef.current;
            if (ok) onSuccess();
            else onError();
          }, 420);
          timers.push(successTimer);
        }
      }, showDelay);

      timers.push(showTimer);
    });
    
    return () => {
      clearInterval(spinner);
      timers.forEach(clearTimeout);
    };
  }, [formData, onSuccess, onError]);

  const filled = Math.round((progress / 100) * PROGRESS_BAR_WIDTH);
  const empty = PROGRESS_BAR_WIDTH - filled;

  return (
    <div ref={containerRef} className="flex flex-col terminal-line mt-4 px-2">
      <p className="text-[#00cfff] font-bold text-sm mb-3 tracking-wider">
        {lang === 'pt' ? '[ INICIANDO TRANSMISSÃO ]' : '[ INITIATING TRANSMISSION ]'}
      </p>

      <p className="font-mono text-xs tracking-wider mb-3">
        <span className="text-[#00ff88]">{'█'.repeat(filled)}</span>
        <span className="text-[#1e3a2a]">{'░'.repeat(empty)}</span>
        <span className="text-[#00cfff] ml-1.5">{progress}%</span>
      </p>

      <div className="flex flex-col">
        {STEPS.slice(0, currentStep + 1).map((step, i) => {
            const done = completedSteps.has(i);
            const active = i === currentStep;
            return (
                <div key={i} className="flex items-center gap-2.5 text-[13px] min-h-[20px] mb-1.5">
                <span className="w-4 text-center shrink-0">
                    {done ? (
                    <span className="text-[#00ff88]">✓</span>
                    ) : active ? (
                    <span className="text-[#00cfff]">{SPINNER_FRAMES[spinnerFrame]}</span>
                    ) : null}
                </span>
                <span className={done ? 'text-[#333]' : active ? 'text-[#e8e8e8]' : 'text-[#333]'}>
                    {lang === 'pt' ? step.text : step.textEn}
                </span>
                </div>
            );
        })}
      </div>
    </div>
  );
}
