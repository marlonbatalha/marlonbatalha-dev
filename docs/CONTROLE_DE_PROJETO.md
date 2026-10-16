# 📂 Controle do Projeto - Portfólio

## 💡 Sobre o Projeto
Este é o **Portfólio Pessoal** do desenvolvedor Marlon Batalha, construído com uma abordagem interativa e criativa: uma **Interface Temática de Terminal**. O objetivo é apresentar habilidades, experiências e projetos de forma imersiva (digitando comandos), fugindo do padrão tradicional de sites.

**Stack Tecnológico Principal:**
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Animações:** CSS (`@keyframes`) + hooks próprios (`useTypewriter`) — sem biblioteca externa
- **Backend (API):** Next.js API Routes + NodeMailer
- **Autenticação:** NextAuth.js (Credentials)

---

Este documento serve para mapearmos exatamente onde estamos, o que já foi criado, e quais são as próximas tarefas do desenvolvimento. Atualize este arquivo sempre que novas _features_ entrarem.

## ✅ Concluído

- **Estruturação Temática de Terminal**
  - Mudança da arquitetura inicial (SPA com scroll) para uma interface imersiva de terminal em `page.tsx` usando o componente `<Terminal/>`.
  - Comandos interativos (`about`, `projects`, `skills`, `contact`, `clear`, `help`) que carregam os componentes correspondentes.
- **Ajustes de SEO e Contexto**
  - Metadados atualizados em `layout.tsx` para refletir o título "Desenvolvedor Full Stack Jr".
  - Textos refinados e formatados para os componentes.
- **Formulário de Contato Dinâmico**
  - Criação de um `<form>` completo no componente `Contact.tsx` gerenciado pelo hook `useContatoForm`.
  - Implementação de Feedback visual e desativação do botão durante o envio (sucesso, enviando, erro).
  - Camada de Backend configurada na rota do Next.js (`src/app/api/contato/route.ts`).
  - Configuração do NodeMailer integrada para uso de SMTP (Gmail) consumindo variáveis de ambiente.

## ⚠️ Pontos de Atenção Imediata (Corrigir antes de prosseguir)

- Nenhuma pendência crítica no momento. 🎉

## 🔄 Próximos Passos (Backlog)
- [x] Lógica de projetos baseada em arquivo de configuração mockado (`src/data/projects.ts`).
- [x] Adicionar micro animações aos blocos da página quando aparecerem em tela (inicialmente com Framer Motion, depois substituído por CSS + typewriter).
- [x] Estruturação da Autenticação via `NextAuth.js` para a área de Dashboard (área logada).
- [x] Login do dashboard sem credenciais/segredo padrão — exige `ADMIN_USER`, `ADMIN_PASS` e `NEXTAUTH_SECRET`.
- [x] SEO: metadados, Open Graph com imagem gerada (`opengraph-image.tsx`), `sitemap.xml`, `robots.txt` e `<html lang>` dinâmico.
- [x] API de contato: validação de tipo/tamanho dos campos (limites em `src/lib/contato.ts`) e logs sem dados pessoais.
- [x] Projetos reais em `src/data/projects.ts` (E-commerce, Day A Day, Gestão Financeira), com links de backend/frontend e tag "em desenvolvimento".
- [ ] Tornar públicos `dayaday-backend`, `dayaday-frontend` e `gestao-financas` (ainda 404 para visitantes).
- [ ] Dashboard: gerenciar projetos e ver mensagens recebidas (exige banco de dados).
- [ ] Modo `--verbose` nos comandos (ver `IMPLEMENTACOES.md`, item 7).
- [ ] Sound design opcional com Web Audio API (ver `IMPLEMENTACOES.md`, item 8).
