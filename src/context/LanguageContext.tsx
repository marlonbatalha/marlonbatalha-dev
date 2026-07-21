'use client'

import React, { createContext, useContext, useCallback, useSyncExternalStore } from 'react';

type Language = 'pt' | 'en';

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

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ptText: string, enText: string) => string;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribeLanguage, getLanguageSnapshot, getLanguageServerSnapshot);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

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
