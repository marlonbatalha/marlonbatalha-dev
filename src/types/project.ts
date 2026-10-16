/**
 * Um projeto exibido pelo comando `projetos` / `projects`.
 *
 * Os textos têm versão em português (obrigatória) e em inglês (opcional).
 * Quando a versão em inglês não existe, o terminal mostra o texto em
 * português também no modo EN — veja `Projects.tsx`.
 *
 * A lista de projetos fica em `src/data/projects.ts`.
 */
export interface Project {
    /** Identificador único do projeto. Usado como `key` na renderização. */
    id: string;
    /** Nome do projeto em português. */
    nome: string;
    /** Nome em inglês. Se omitido, usa `nome`. */
    nomeEn?: string;
    /** Descrição curta (uma frase) em português. */
    descricao: string;
    /** Descrição em inglês. Se omitida, usa `descricao`. */
    descricaoEn?: string;
    /** Tecnologias usadas, exibidas separadas por ` · ` (ex.: `["React", "Node.js"]`). */
    tecnologias: string[];
    /**
     * Repositórios do código-fonte, exibidos como links `[rótulo]`. Projetos
     * com backend e frontend separados têm um item para cada
     * (ex.: `{ rotulo: "Backend", url: "..." }`). Sem `rotulo`, o link aparece
     * como "Repositório".
     */
    repositorios?: { rotulo?: string; url: string }[];
    /** URL do projeto publicado (site, loja de apps...). Se omitida, o link não aparece. */
    linkLive?: string;
    /** Se `true`, mostra a tag "em desenvolvimento" ao lado do nome. */
    emDesenvolvimento?: boolean;
}
