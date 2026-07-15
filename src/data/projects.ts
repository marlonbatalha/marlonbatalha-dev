import { Project } from "@/types/project";

export const projects: Project[] = [
    {
        id: "1",
        nome: "Portfólio Terminal",
        descricao: "Meu portfólio pessoal com interface imersiva de terminal desenvolvido em Next.js e Tailwind CSS.",
        tecnologias: ["Next.js", "TypeScript", "Tailwind CSS"],
        linkRepositorio: "https://github.com/marlonbatalha/marlonbatalha-dev",
        linkLive: "https://marlonbatalha.dev",
    },
    {
        id: "2",
        nome: "E-commerce XPTO",
        descricao: "Plataforma completa de vendas online com carrinho de compras, integração de pagamentos e painel administrativo.",
        tecnologias: ["React", "Node.js", "PostgreSQL", "Stripe"],
        linkRepositorio: "https://github.com/marlonbatalha/ecommerce-xpto",
    },
    {
        id: "3",
        nome: "App de Tarefas",
        descricao: "Aplicativo de gestão de tempo e tarefas baseado na técnica Pomodoro.",
        tecnologias: ["React Native", "Expo", "SQLite"],
        linkLive: "https://play.google.com/store/apps/details?id=tarefas",
    }
];
