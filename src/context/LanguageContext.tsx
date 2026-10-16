'use client'

import React, { createContext, useContext, useCallback, useEffect, useSyncExternalStore } from 'react';

/**
 * Idiomas suportados pelo portfólio. O padrão é `pt`; a escolha do visitante
 * fica salva no `localStorage` (chave `portfolio_lang`).
 */
export type Language = 'pt' | 'en';

const STORAGE_KEY = 'portfolio_lang';
const LANG_EVENT = 'portfolio_lang_change';

// localStorage tratado como store externo — evita setState dentro de effect
// e mantém a hidratação segura (o servidor sempre parte de 'pt').
function subscribeLanguage(callback: () => void) {
  window.addEventListener(LANG_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(LANG_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getLanguageSnapshot(): Language {
  return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'pt';
}

function getLanguageServerSnapshot(): Language {
  return 'pt';
}

// Detecta hidratação no cliente sem chamar setState dentro de um effect
const emptySubscribe = () => () => {};

/** O que `useLanguage()` devolve. */
interface LanguageContextType {
  /** Idioma atual. No servidor e no primeiro render do cliente é sempre `pt`. */
  language: Language;
  /** Troca o idioma, salva no `localStorage` e re-renderiza todos os componentes que usam o contexto. */
  setLanguage: (lang: Language) => void;
  /**
   * Escolhe o texto do idioma atual: `t('Olá', 'Hello')`.
   *
   * Recebe as duas versões no próprio call site em vez de usar chaves de
   * tradução — simples para um site pequeno e com só dois idiomas.
   */
  t: (ptText: string, enText: string) => string;
  /**
   * `true` depois que o componente hidratou no cliente. Antes disso o idioma
   * salvo ainda não foi lido; use para esconder o conteúdo e evitar um
   * "piscar" de PT para EN (o `Terminal` faz isso com a opacidade).
   */
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribeLanguage, getLanguageSnapshot, getLanguageServerSnapshot);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Mantém o <html lang> em sincronia com o idioma escolhido (leitores de
  // tela e tradutores do navegador usam esse atributo).
  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new Event(LANG_EVENT));
  }, []);

  const t = (ptText: string, enText: string) => {
    return language === 'pt' ? ptText : enText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
