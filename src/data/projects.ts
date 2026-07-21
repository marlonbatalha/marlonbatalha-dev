import { Project } from "@/types/project";

export const projects: Project[] = [
    {
        id: "1",
        nome: "E-commerce XPTO",
        nomeEn: "XPTO E-commerce",
        descricao: "Plataforma completa de vendas online com carrinho de compras, integração de pagamentos e painel administrativo.",
        descricaoEn: "Complete online sales platform with shopping cart, payment integration, and admin panel.",
        tecnologias: ["React", "Node.js", "PostgreSQL", "Stripe"],
        linkRepositorio: "https://github.com/marlonbatalha/ecommerce-xpto",
    },
    {
        id: "2",
        nome: "App de Tarefas",
        nomeEn: "Task App",
        descricao: "Aplicativo de gestão de tempo e tarefas baseado na técnica Pomodoro.",
        descricaoEn: "Time and task management application based on the Pomodoro technique.",
        tecnologias: ["React Native", "Expo", "SQLite"],
        linkLive: "https://play.google.com/store/apps/details?id=tarefas",
    },
    {
        id: "3",
        nome: "Aplicativo de Gestao Financeira",
        nomeEn: "Finance Management App",
        descricao: "Aplicativo de gestão financeira pessoal com funcionalidades de rastreamento de despesas e receitas.",
        descricaoEn: "Personal finance management app with features for tracking expenses and income.",
        tecnologias: ["React Native", "Expo", "SQLite"],
        linkRepositorio: "https://github.com/marlonbatalha/personal-finance-app",
    }
];
