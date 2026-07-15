import React from "react";
import { projects } from "@/data/projects";
import { useLanguage } from '@/context/LanguageContext';

export default function Projects() {
    const { language, t } = useLanguage();

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl text-[#e8e8e8] terminal-line">
            <h2 className="text-[#00cfff] font-bold mb-2">{t('Meus Projetos:', 'My Projects:')}</h2>
            {projects.map((project) => (
                <div key={project.id} className="border-l-2 border-[#222] pl-4 py-1">
                    <h3 className="text-lg font-semibold text-[#00ff88]">
                        {language === 'pt' ? project.nome : (project.nomeEn || project.nome)}
                    </h3>
                    <p className="mt-1 text-sm text-[#666]">
                        {language === 'pt' ? project.descricao : (project.descricaoEn || project.descricao)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {project.tecnologias.map((tech) => (
                            <span key={tech} className="bg-[#111] border border-[#333] text-[#a78bfa] text-xs px-2 py-1 rounded">
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className="mt-3 flex gap-4 text-sm">
                        {project.linkRepositorio && (
                            <a href={project.linkRepositorio} target="_blank" rel="noopener noreferrer" className="text-[#36a3d9] hover:underline">
                                [{t('Repositório', 'Repository')}]
                            </a>
                        )}
                        {project.linkLive && (
                            <a href={project.linkLive} target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline">
                                [{t('Ver ao vivo', 'Live demo')}]
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}