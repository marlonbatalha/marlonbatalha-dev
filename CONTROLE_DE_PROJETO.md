# 📂 Controle do Projeto - Portfólio

Este documento serve para mapearmos exatamente onde estamos, o que já foi criado, e quais são as próximas tarefas do desenvolvimento. Atualize este arquivo sempre que novas _features_ entrarem.

## ✅ Concluído

- **Estruturação SPA (Single Page Application)**
  - Mapeamento das seções em componentes (`Hero`, `Projetos`, `Sobre`, `Contato`) renderizados em _scroll_ na `page.tsx`.
  - Navegação suave através de links âncora do `Header.tsx`.
- **Ajustes de SEO e Contexto**
  - Metadados atualizados em `layout.tsx` para refletir o título "Desenvolvedor Full Stack Jr".
  - Textos de introdução em `Sobre.tsx` e descrições dos `Projetos.tsx` refinados e detalhadamente formatados.
- **Formulário de Contato Dinâmico**
  - Transformado de um simples link "mailto" para um `<form>` complexo gerenciado por estado.
  - Campos adicionados: Nome, E-mail, Mensagem.
  - Implementação de Feedback visual (sucesso / erro).
  - Primeira versão da camada de Backend nas rotas do Next.js (`src/app/api/contato/routs.ts`).

## ⚠️ Pontos de Atenção Imediata (Corrigir antes de prosseguir)

- [ ] **Nome do arquivo da rota de API:** O Next.js (App router) exige que as rotas se chamem obrigatoriamente `route.ts`. O arquivo foi criado como `routs.ts`. Precisamos renomeá-lo.
- [ ] **Hook `useContatoForm` ausente:** O componente de contato importou o hook `useContatoForm`, porém um arquivo com sintaxe muito parecida foi deletado. Precisamos garantir que esse _hook_ existe e está funcionando (ou recriá-lo).

## 🔄 Próximos Passos (Backlog)

- [ ] Configurar envio real de e-mails usando NodeMailer ou Resend no backend da API de contato.
- [ ] Preparar lógica de Banco de Dados ou Arquivo de configuração base para puxar projetos de um CMS.
- [ ] Adicionar micro animações usando Framer Motion aos blocos da página quando aparecerem em tela.
- [ ] Estruturação da Autenticação via `NextAuth.js` para a área de Dashboard (área logada).
