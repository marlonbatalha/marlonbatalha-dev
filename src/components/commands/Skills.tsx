import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TypewriterText from '../ui/TypewriterText';

export default function Skills() {
  const { t } = useLanguage();
  const [headerDone, setHeaderDone] = useState(false);

  const skills = [
    { category: t("Front-end", "Front-end"), list: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { category: t("Back-end & DB", "Back-end & DB"), list: [".NET C#", "Node.js", "SQL Server", "APIs REST"] },
    { category: t("Cloud & DevOps", "Cloud & DevOps"), list: ["Azure Services", "GitHub Actions (CI/CD)", "Git / GitHub"] },
    { category: t("Segurança & Infra", "Security & Infra"), list: [t("Segurança da Informação", "Information Security"), t("Firewalls & Redes", "Firewalls & Networks"), t("Mitigação DDoS/DTOs", "DDoS/DTO Mitigation"), t("Hardware & Software", "Hardware & Software")] },
    { category: t("Formação & Idiomas", "Education & Languages"), list: [t("Graduação em ADS", "Systems Analysis Degree (ADS)"), t("Inglês Intermediário", "Intermediate English")] },
    { category: t("Cursos & Certificados", "Courses & Certificates"), list: ["Microsoft (.NET)", "FGV (Banco de Dados)", "Santander (LGPD)"] }
  ];

  return (
    <div className="flex flex-col gap-4 max-w-4xl terminal-line">
      <TypewriterText
        lines={[t('Tech Stack & Habilidades:', 'Tech Stack & Skills:')]}
        renderLine={(line) => <h2 className="text-[#00cfff] font-bold mb-2">{line}</h2>}
        onComplete={() => setHeaderDone(true)}
      />

      {headerDone && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* key pelo índice, não pela categoria traduzida: a lista tem ordem
              e tamanho fixos, só o texto muda com o idioma — usar o texto
              como key remontaria os cards (e o item da lista) a cada troca
              de BR/EN, disparando de novo o fade-in com stagger. */}
          {skills.map((skillGroup, i) => (
            <div
              key={i}
              className="p-3 border border-[#222] rounded bg-[#111] terminal-line"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <h3 className="text-[#00ff88] font-semibold mb-3 border-b border-[#222] pb-1">{skillGroup.category}</h3>
              <ul className="flex flex-col gap-2">
                {skillGroup.list.map((tech, j) => (
                  <li key={j} className="flex items-center gap-2 text-[#e8e8e8] text-sm">
                    <span className="text-[#36a3d9]">-</span>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
