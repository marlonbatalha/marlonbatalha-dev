# 📂 Controle do Projeto - Portfólio

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
- [ ] Adicionar micro animações usando Framer Motion aos blocos da página quando aparecerem em tela.
- [ ] Estruturação da Autenticação via `NextAuth.js` para a área de Dashboard (área logada).
