import { Project } from "@/types/project";

export const projects: Project[] = [
    {
        id: "1",
        nome: "Portfólio Terminal",
        nomeEn: "Terminal Portfolio",
        descricao: "Meu portfólio pessoal com interface imersiva de terminal desenvolvido em Next.js e Tailwind CSS.",
        descricaoEn: "My personal portfolio with an immersive terminal interface built with Next.js and Tailwind CSS.",
        tecnologias: ["Next.js", "TypeScript", "Tailwind CSS"],
        linkRepositorio: "https://github.com/marlonbatalha/marlonbatalha-dev",
        linkLive: "https://marlonbatalha.dev",
    },
    {
        id: "2",
        nome: "E-commerce XPTO",
        nomeEn: "XPTO E-commerce",
        descricao: "Plataforma completa de vendas online com carrinho de compras, integração de pagamentos e painel administrativo.",
        descricaoEn: "Complete online sales platform with shopping cart, payment integration, and admin panel.",
        tecnologias: ["React", "Node.js", "PostgreSQL", "Stripe"],
        linkRepositorio: "https://github.com/marlonbatalha/ecommerce-xpto",
    },
    {
        id: "3",
        nome: "App de Tarefas",
        nomeEn: "Task App",
        descricao: "Aplicativo de gestão de tempo e tarefas baseado na técnica Pomodoro.",
        descricaoEn: "Time and task management application based on the Pomodoro technique.",
        tecnologias: ["React Native", "Expo", "SQLite"],
        linkLive: "https://play.google.com/store/apps/details?id=tarefas",
    }
];
