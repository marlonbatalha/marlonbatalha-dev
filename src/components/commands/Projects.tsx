import React from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";
import { useLanguage } from '@/context/LanguageContext';
import TypewriterText from '../TypewriterText';

type LineMeta =
  | { type: 'header' }
  | { type: 'spacer' }
  | { type: 'title' | 'desc' | 'tech'; project: Project };

export default function Projects() {
    const { language, t } = useLanguage();

    const lines: string[] = [];
    const meta: LineMeta[] = [];

    lines.push(t('Meus Projetos:', 'My Projects:'));
    meta.push({ type: 'header' });
    lines.push('');
    meta.push({ type: 'spacer' });

    projects.forEach((project, i) => {
        const nome = language === 'pt' ? project.nome : (project.nomeEn || project.nome);
        const descricao = language === 'pt' ? project.descricao : (project.descricaoEn || project.descricao);

        lines.push(nome);
        meta.push({ type: 'title', project });

        lines.push(descricao);
        meta.push({ type: 'desc', project });

        lines.push(project.tecnologias.join(' · '));
        meta.push({ type: 'tech', project });

        if (i < projects.length - 1) {
            lines.push('');
            meta.push({ type: 'spacer' });
        }
    });

    const renderLine = (line: string, index: number) => {
        const m = meta[index];
        if (!m) return line;

        if (m.type === 'header') {
            return <span className="text-[#00cfff] font-bold">{line}</span>;
        }
        if (m.type === 'spacer') return line;

        if (m.type === 'title') {
            return <span className="text-lg font-semibold text-[#00ff88]">{line}</span>;
        }
        if (m.type === 'desc') {
            return <span className="text-sm text-[#666]">{line}</span>;
        }

        // m.type === 'tech' — os badges e links só aparecem quando a linha termina de digitar
        const { project } = m;
        const isDone = line === lines[index];
        return (
            <div className="flex flex-col gap-2 mt-1">
                <span className="text-xs text-[#a78bfa]">{line}</span>
                {isDone && (
                    <div className="flex flex-wrap items-center gap-2 terminal-line">
                        {project.tecnologias.map((tech) => (
                            <span key={tech} className="bg-[#111] border border-[#333] text-[#a78bfa] text-xs px-2 py-1 rounded">
                                {tech}
                            </span>
                        ))}
                        <div className="flex gap-4 text-sm ml-2">
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
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-1 w-full max-w-2xl text-[#e8e8e8] terminal-line">
            <TypewriterText lines={lines} renderLine={renderLine} baseSpeed={16} humanVariance={8} lineDelay={150} />
        </div>
    );
}
