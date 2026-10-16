// URL pública do site, usada nos metadados (Open Graph), sitemap e robots.
// Ordem: valor explícito > domínio oficial em produção > local.
export const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production" ? "https://marlonbatalha.com" : "http://localhost:3000");

export const siteName = "Marlon Batalha";
export const siteTitle = "Marlon Batalha — Desenvolvedor Full Stack";
export const siteDescription =
    "Portfólio interativo em formato de terminal de Marlon Batalha, desenvolvedor Full Stack. Digite comandos para conhecer projetos, habilidades e formas de contato.";
