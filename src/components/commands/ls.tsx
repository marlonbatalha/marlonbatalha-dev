import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#36a3d9]">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
  </svg>
);

export default function Ls() {
  const { t } = useLanguage();

  return (
    <div className="flex gap-6 text-[#00cfff] terminal-line">
      <div className="flex items-center gap-2 font-bold"><FolderIcon /> {t('sobre', 'about')}</div>
      <div className="flex items-center gap-2 font-bold"><FolderIcon /> {t('projetos', 'projects')}</div>
      <div className="flex items-center gap-2 font-bold"><FolderIcon /> {t('habilidades', 'skills')}</div>
      <div className="flex items-center gap-2 font-bold"><FolderIcon /> {t('contato', 'contact')}</div>
    </div>
  );
}
