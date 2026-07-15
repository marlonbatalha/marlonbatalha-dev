import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-3 max-w-xl text-[#e8e8e8] terminal-line">
      <h2 className="text-[#00cfff] font-bold mb-1">{t('Informações de Contato:', 'Contact Information:')}</h2>
      
      <p className="text-sm text-[#666] mb-2">
        {t('Sinta-se à vontade para me mandar um e-mail ou conectar nas redes sociais.', 'Feel free to send me an email or connect on social media.')}
      </p>

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-center gap-3">
          <span className="text-[#a78bfa] w-16 text-right">Email:</span>
          <a href="mailto:contato@marlonbatalha.dev" className="text-[#00ff88] hover:underline">contato@marlonbatalha.dev</a>
        </li>
        <li className="flex items-center gap-3">
          <span className="text-[#a78bfa] w-16 text-right">LinkedIn:</span>
          <a href="https://linkedin.com/in/marlonbatalha" target="_blank" rel="noopener noreferrer" className="text-[#36a3d9] hover:underline">linkedin.com/in/marlonbatalha</a>
        </li>
        <li className="flex items-center gap-3">
          <span className="text-[#a78bfa] w-16 text-right">GitHub:</span>
          <a href="https://github.com/marlonbatalha" target="_blank" rel="noopener noreferrer" className="text-[#e8e8e8] hover:underline">github.com/marlonbatalha</a>
        </li>
      </ul>
    </div>
  );
}
