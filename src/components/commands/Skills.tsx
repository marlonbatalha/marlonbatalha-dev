import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TypewriterText from '../ui/TypewriterText';
import { projects } from '@/data/projects';
import {
  findSkill,
  formacao,
  normalizeTech,
  skillCategories,
  skillKeys,
  type Skill,
  type SkillCategory,
} from '@/data/skills';
import { runTerminalCommand } from '@/lib/terminalEvents';

interface SkillsProps {
  /** Texto após o comando (`habilidades oracle` → `"oracle"`). Vazio = árvore completa. */
  query?: string;
}

/**
 * Comando `habilidades` / `skills`.
 *
 * - Sem argumento: árvore de "pastas" por área, digitada como o resto do
 *   terminal. Ao terminar cada linha, as tecnologias viram links que rodam
 *   `habilidades <tecnologia>`.
 * - Com argumento: detalhe da tecnologia e os projetos que a usam — cruzando
 *   com `src/data/projects.ts`, em vez de "níveis" ou porcentagens inventadas.
 */
export default function Skills({ query }: SkillsProps) {
  return query ? <SkillDetail query={query} /> : <SkillTree />;
}

/**
 * Papel de cada linha da árvore (`meta[i]` descreve `lines[i]`; mesmo padrão
 * de `Projects.tsx`).
 *
 * - `root`: a raiz `habilidades/`.
 * - `category`: uma pasta e suas tecnologias. `splitAt` é onde termina o
 *   trecho `├── backend/` (com espaços de alinhamento) e começa a lista;
 *   os 4 primeiros caracteres são sempre o ramo (`├── ` / `└── `).
 * - `info`: linha `Rótulo: valor` do bloco de formação.
 * - `spacer` / `hint`: linha em branco e dica de uso.
 */
type TreeLineMeta =
  | { type: 'root' }
  | { type: 'category'; category: SkillCategory; splitAt: number }
  | { type: 'info'; splitAt: number }
  | { type: 'spacer' }
  | { type: 'hint' };

const BRANCH_LEN = 4;   // `├── `
const FOLDER_COL = 15; // largura de `└── seguranca/ ` em caracteres
const INFO_COL = 11;   // largura de `Languages: `

function SkillTree() {
  const { language, t } = useLanguage();
  const skillName = (s: Skill) => (language === 'en' && s.nomeEn) || s.nome;
  const command = t('habilidades', 'skills');

  const lines: string[] = [];
  const meta: TreeLineMeta[] = [];

  lines.push(`${command}/`);
  meta.push({ type: 'root' });

  skillCategories.forEach((category, i) => {
    const branch = i === skillCategories.length - 1 ? '└── ' : '├── ';
    const folder = `${branch}${language === 'en' ? category.pastaEn : category.pasta}/`.padEnd(FOLDER_COL);
    lines.push(folder + category.itens.map(skillName).join(' · '));
    meta.push({ type: 'category', category, splitAt: folder.length });
  });

  lines.push('');
  meta.push({ type: 'spacer' });

  const pushInfo = (label: string, value: string) => {
    const head = `${label}:`.padEnd(INFO_COL);
    lines.push(head + value);
    meta.push({ type: 'info', splitAt: head.length });
  };
  pushInfo(t('Formação', 'Education'), t(formacao.graduacao.pt, formacao.graduacao.en));
  pushInfo(t('Idiomas', 'Languages'), t(formacao.idiomas.pt, formacao.idiomas.en));
  pushInfo(t('Cursos', 'Courses'), (language === 'en' ? formacao.cursosEn : formacao.cursos).join(' · '));

  lines.push('');
  meta.push({ type: 'spacer' });
  lines.push(t(
    `Toque numa tecnologia ou digite "${command} <tecnologia>" para ver onde usei.`,
    `Tap a technology or type "${command} <technology>" to see where I used it.`,
  ));
  meta.push({ type: 'hint' });

  const renderLine = (line: string, index: number) => {
    const m = meta[index];
    if (!m || m.type === 'spacer') return line;
    if (m.type === 'root') return <span className="text-term-cyan font-bold">{line}</span>;
    if (m.type === 'hint') return <span className="text-term-dim text-sm">{line}</span>;

    // Duas colunas de verdade (grid), como no `ajuda`: no celular a lista
    // quebra dentro da própria coluna, sem cair embaixo do nome da pasta.
    const head = line.slice(0, m.splitAt).trimEnd();
    const rest = line.slice(m.splitAt);

    if (m.type === 'info') {
      return (
        <span className="inline-grid grid-cols-[11ch_1fr] align-top text-sm">
          <span className="text-term-muted">{head}</span>
          <span className="text-term-text">{rest}</span>
        </span>
      );
    }

    // m.type === 'category' — vira links quando a linha termina de digitar.
    // O ramo (`├── `) tem coluna própria e com folga: os caracteres de caixa
    // não estão no recorte "latin" da JetBrains Mono, então o navegador usa
    // uma fonte reserva mais larga e a largura em `ch` não é confiável.
    const branch = line.slice(0, BRANCH_LEN);
    const folder = line.slice(BRANCH_LEN, m.splitAt).trimEnd();
    const isDone = line === lines[index];
    const lastItem = m.category.itens.length - 1;
    return (
      <span className="inline-grid grid-cols-[6ch_11ch_minmax(0,1fr)] gap-x-2 align-top">
        <span className="text-term-line-strong">{branch}</span>
        <span className="text-term-cyan">{folder}</span>
        <span className="text-term-text">
          {isDone
            ? m.category.itens.map((skill, j) => (
                // Item + separador num bloco sem quebra, e o espaço FORA dele:
                // no celular a linha quebra só entre tecnologias, nunca no meio
                // de um nome nem começando com "·".
                <React.Fragment key={j}>
                  <span className="whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => runTerminalCommand(`${command} ${skill.nome.toLowerCase()}`)}
                      className="cursor-pointer hover:text-term-green hover:underline underline-offset-4"
                    >
                      {skillName(skill)}
                    </button>
                    {j < lastItem && <span className="text-term-faint"> ·</span>}
                  </span>
                  {j < lastItem && ' '}
                </React.Fragment>
              ))
            : rest}
        </span>
      </span>
    );
  };

  return (
    <div className="terminal-line w-full max-w-3xl">
      <TypewriterText lines={lines} renderLine={renderLine} baseSpeed={14} humanVariance={6} lineDelay={90} />
    </div>
  );
}

function SkillDetail({ query }: { query: string }) {
  const { language, t } = useLanguage();
  const command = t('habilidades', 'skills');
  const found = findSkill(query);

  if (!found) {
    return (
      <div className="terminal-line">
        <TypewriterText
          lines={[
            t(`Tecnologia não encontrada: ${query}`, `Technology not found: ${query}`),
            t(`Digite "${command}" para ver a lista completa.`, `Type "${command}" to see the full list.`),
          ]}
          renderLine={(line, i) => <span className={i === 0 ? 'text-term-red' : 'text-term-dim'}>{line}</span>}
        />
      </div>
    );
  }

  const { skill, categoria } = found;
  const keys = skillKeys(skill);
  const usedIn = projects.filter((p) => p.tecnologias.some((tech) => keys.includes(normalizeTech(tech))));
  const name = (language === 'en' && skill.nomeEn) || skill.nome;
  const folder = `${language === 'en' ? categoria.pastaEn : categoria.pasta}/`;

  const lines = [
    `${name}  ${folder}`,
    usedIn.length
      ? t('Usado em:', 'Used in:')
      : t('Ainda não há projeto público com esta tecnologia.', 'No public project with this technology yet.'),
    ...usedIn.map((p) => `  ${(language === 'en' && p.nomeEn) || p.nome}`),
  ];

  const renderLine = (line: string, index: number) => {
    if (index === 0) {
      return (
        <span>
          <span className="text-term-green font-bold">{line.slice(0, name.length)}</span>
          <span className="text-term-muted">{line.slice(name.length)}</span>
        </span>
      );
    }
    if (index === 1) return <span className="text-term-dim">{line}</span>;

    const project = usedIn[index - 2];
    const isDone = line === lines[index];
    return (
      <span>
        <span className="text-term-text">{line}</span>
        {isDone &&
          project.repositorios?.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 text-sm text-term-link hover:underline"
            >
              [{repo.rotulo ?? t('Repositório', 'Repository')}]
            </a>
          ))}
      </span>
    );
  };

  return (
    <div className="terminal-line">
      <TypewriterText lines={lines} renderLine={renderLine} lineDelay={90} />
    </div>
  );
}
