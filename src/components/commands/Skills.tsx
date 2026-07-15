import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Skills() {
  const { t } = useLanguage();

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
      <h2 className="text-[#00cfff] font-bold mb-2">{t('Tech Stack & Habilidades:', 'Tech Stack & Skills:')}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {skills.map((skillGroup) => (
          <div key={skillGroup.category} className="p-3 border border-[#222] rounded bg-[#111]">
            <h3 className="text-[#00ff88] font-semibold mb-3 border-b border-[#222] pb-1">{skillGroup.category}</h3>
            <ul className="flex flex-col gap-2">
              {skillGroup.list.map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-[#e8e8e8] text-sm">
                  <span className="text-[#36a3d9]">-</span>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
