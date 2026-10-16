/**
 * Uma tecnologia exibida pelo comando `habilidades` / `skills`.
 */
export interface Skill {
    /** Nome exibido (igual nos dois idiomas, salvo itens descritivos). */
    nome: string;
    /** Nome em inglês, só para itens que não são nome próprio (ex.: "Redes"). */
    nomeEn?: string;
    /**
     * Outros nomes que identificam a tecnologia — usados no subcomando
     * (`habilidades sqlserver`) e para achar os projetos que a usam, comparando
     * com `Project.tecnologias` (ex.: ".NET" também casa com ".NET 10").
     * Comparação sem maiúsculas, espaços, pontos ou hífens.
     */
    aliases?: string[];
}

/** Um grupo da árvore de `habilidades`, exibido como uma "pasta". */
export interface SkillCategory {
    /** Nome da pasta em português, sem acento (ex.: `seguranca`). */
    pasta: string;
    /** Nome da pasta em inglês. */
    pastaEn: string;
    itens: Skill[];
}

export const skillCategories: SkillCategory[] = [
    {
        pasta: "backend",
        pastaEn: "backend",
        itens: [
            { nome: "C#" },
            { nome: ".NET", aliases: [".NET 10", "dotnet"] },
            { nome: "ASP.NET Core" },
            { nome: "EF Core", aliases: ["Entity Framework"] },
            { nome: "Node.js", aliases: ["node"] },
            { nome: "NestJS", aliases: ["nest"] },
        ],
    },
    {
        pasta: "banco",
        pastaEn: "database",
        itens: [
            { nome: "SQL Server", aliases: ["mssql"] },
            { nome: "Oracle" },
            { nome: "PostgreSQL", aliases: ["postgres", "pg"] },
            { nome: "SQLite" },
        ],
    },
    {
        pasta: "frontend",
        pastaEn: "frontend",
        itens: [
            { nome: "React" },
            { nome: "Next.js", aliases: ["next"] },
            { nome: "TypeScript", aliases: ["ts"] },
            { nome: "Tailwind CSS", aliases: ["tailwind"] },
        ],
    },
    {
        pasta: "mobile",
        pastaEn: "mobile",
        itens: [
            { nome: "React Native", aliases: ["rn"] },
            { nome: "Expo" },
        ],
    },
    {
        pasta: "cloud",
        pastaEn: "cloud",
        itens: [
            { nome: "Azure" },
            { nome: "Azure Functions", aliases: ["functions"] },
            { nome: "Azure Service Bus", aliases: ["service bus", "servicebus"] },
            { nome: "Docker" },
            { nome: "GitHub Actions", aliases: ["ci/cd", "cicd", "actions"] },
        ],
    },
    {
        pasta: "seguranca",
        pastaEn: "security",
        itens: [
            { nome: "Firewalls" },
            { nome: "Redes", nomeEn: "Networking", aliases: ["networks"] },
            { nome: "Mitigação de DDoS", nomeEn: "DDoS mitigation", aliases: ["ddos", "dos"] },
        ],
    },
];

/** Formação, idiomas e cursos — bloco à parte, abaixo da árvore. */
export const formacao = {
    graduacao: {
        pt: "Análise e Desenvolvimento de Sistemas (em andamento, conclusão em 2026)",
        en: "Systems Analysis and Development (in progress, graduating in 2026)",
    },
    idiomas: {
        pt: "Inglês intermediário",
        en: "Intermediate English",
    },
    cursos: ["Microsoft (.NET)", "FGV (Banco de Dados)", "Santander (LGPD)"],
    cursosEn: ["Microsoft (.NET)", "FGV (Databases)", "Santander (LGPD)"],
};

/** Normaliza para comparação: sem maiúsculas, espaços, pontos ou hífens. */
export const normalizeTech = (s: string) => s.toLowerCase().replace(/[\s.\-]/g, "");

/** Todos os nomes (normalizados) pelos quais uma tecnologia é reconhecida. */
export const skillKeys = (skill: Skill) =>
    [skill.nome, skill.nomeEn, ...(skill.aliases ?? [])]
        .filter((n): n is string => Boolean(n))
        .map(normalizeTech);

/** Procura uma tecnologia pelo nome ou apelido digitado. */
export function findSkill(query: string): { skill: Skill; categoria: SkillCategory } | null {
    const q = normalizeTech(query);
    if (!q) return null;
    for (const categoria of skillCategories) {
        const skill = categoria.itens.find((s) => skillKeys(s).includes(q));
        if (skill) return { skill, categoria };
    }
    return null;
}
