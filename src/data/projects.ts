import { Project } from "@/types/project";

export const projects: Project[] = [
    {
        id: "ecommerce",
        nome: "E-commerce XPTO",
        nomeEn: "XPTO E-commerce",
        descricao: "Loja virtual completa: API em .NET com Clean Architecture e autenticação JWT, e frontend em Next.js com catálogo, carrinho, checkout e painel administrativo.",
        descricaoEn: "Full online store: a .NET API built with Clean Architecture and JWT authentication, and a Next.js frontend with catalog, cart, checkout and admin panel.",
        tecnologias: ["C#", ".NET 10", "ASP.NET Core", "EF Core", "Oracle", "Docker", "Next.js", "TypeScript"],
        repositorios: [
            { rotulo: "Backend", url: "https://github.com/marlonbatalha/ecomerce-backend" },
            { rotulo: "Frontend", url: "https://github.com/marlonbatalha/ecomerce-frontend" },
        ],
        emDesenvolvimento: true,
    },
    {
        id: "dayaday",
        nome: "Day A Day",
        descricao: "Aplicativo de organização de tarefas do dia a dia.",
        descricaoEn: "Everyday task management app.",
        tecnologias: ["React Native", "Expo", "SQLite"],
        repositorios: [
            { rotulo: "Backend", url: "https://github.com/marlonbatalha/dayaday-backend" },
            { rotulo: "Frontend", url: "https://github.com/marlonbatalha/dayaday-frontend" },
        ],
        emDesenvolvimento: true,
    },
    {
        id: "gestao-financas",
        nome: "Gestão Financeira",
        nomeEn: "Finance Manager",
        descricao: "Aplicativo de gestão financeira pessoal com controle de despesas e receitas.",
        descricaoEn: "Personal finance app for tracking expenses and income.",
        tecnologias: ["React Native", "Expo", "PostgreSQL"],
        repositorios: [
            { url: "https://github.com/marlonbatalha/gestao-financas" },
        ],
        emDesenvolvimento: true,
    },
];
