# marlonbatalha.com — Portfólio Terminal

Portfólio pessoal de **Marlon Batalha**, desenvolvedor Full Stack, em formato de **terminal interativo**: em vez de rolar uma página, o visitante digita comandos para conhecer projetos, habilidades e entrar em contato.

## ✨ Funcionalidades

- **Terminal interativo** com prompt colorido, efeito de digitação (typewriter) e título com efeito glitch/Tetris
- **Bilíngue (PT/EN)** — cada idioma tem seus próprios comandos (`ajuda`/`help`, `sobre`/`about`…)
- **Atalhos de terminal real**: histórico com `↑`/`↓`, autocompletar com `Tab`, `Ctrl+L` para limpar e `Ctrl+C` para cancelar
- **Contato pelo terminal** — o comando `contato` abre um fluxo de perguntas e envia a mensagem por email (SMTP), com rate limit
- **Easter eggs** escondidos 👀
- **Dashboard** protegido por login (NextAuth)
- SEO com Open Graph (imagem de preview gerada automaticamente), `sitemap.xml` e `robots.txt`
- Respeita `prefers-reduced-motion`

## ⌨️ Comandos

| PT            | EN         | Descrição                    |
| ------------- | ---------- | ---------------------------- |
| `ajuda`       | `help`     | Lista os comandos            |
| `sobre`       | `about`    | Sobre mim                    |
| `projetos`    | `projects` | Meus projetos                |
| `habilidades` | `skills`   | Habilidades técnicas         |
| `contato`     | `contact`  | Envia uma mensagem           |
| `whoami`      | `whoami`   | Resumo rápido                |
| `ls`          | `ls`       | Lista diretórios             |
| `limpar`      | `clear`    | Limpa o terminal             |

## 🛠️ Tecnologias

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [NextAuth.js](https://next-auth.js.org) — autenticação do dashboard
- [Nodemailer](https://nodemailer.com) — envio do formulário de contato
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)

## 🚀 Como rodar

Este projeto usa [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.example .env   # e preencha os valores
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

## 🔐 Variáveis de ambiente

| Variável               | Obrigatória | Descrição                                                               |
| ---------------------- | ----------- | ----------------------------------------------------------------------- |
| `EMAIL_USER`           | Sim         | Conta que autentica no SMTP                                             |
| `EMAIL_PASS`           | Sim         | Senha (no Gmail, uma *Senha de App*)                                    |
| `EMAIL_TO`             | Não         | Quem recebe as mensagens (padrão: `EMAIL_USER`)                         |
| `EMAIL_FROM`           | Não         | Remetente exibido (padrão: `EMAIL_USER`)                                |
| `EMAIL_HOST`           | Não         | Servidor SMTP (padrão: `smtp.gmail.com`)                                |
| `EMAIL_PORT`           | Não         | Porta SMTP (padrão: `465`)                                              |
| `ADMIN_USER`           | Dashboard   | Usuário do login — sem ele o login fica desativado                      |
| `ADMIN_PASS`           | Dashboard   | Senha do login                                                          |
| `NEXTAUTH_SECRET`      | Em produção | Chave que assina as sessões (`openssl rand -base64 32`)                 |
| `NEXTAUTH_URL`         | Em produção | URL do site                                                             |
| `NEXT_PUBLIC_SITE_URL` | Não         | URL pública para SEO/Open Graph (padrão em produção: marlonbatalha.com) |

## 📁 Estrutura

```text
src/
├── app/
│   ├── api/contato/        # Envio do formulário (SMTP + rate limit)
│   ├── api/auth/           # NextAuth
│   ├── dashboard/          # Área logada
│   ├── login/
│   ├── opengraph-image.tsx # Imagem de preview para redes sociais
│   ├── robots.ts / sitemap.ts
│   └── layout.tsx / page.tsx
├── components/
│   ├── Terminal.tsx        # Input, histórico e despacho de comandos
│   ├── commands/           # Um componente por comando + registry.tsx
│   ├── ui/                 # Typewriter, Glitch, Spinner
│   └── layout/
├── context/LanguageContext.tsx  # Idioma PT/EN
├── data/projects.ts        # Lista de projetos exibida em `projetos`
├── hooks/
└── lib/                    # auth, dados do site, limites do contato
```

### Adicionando um comando

1. Crie o componente em `src/components/commands/`
2. Registre os nomes PT e EN em `commandRegistry` e `getAvailableCommands` (`registry.tsx`)
3. Adicione a linha no `Help` do mesmo arquivo

## ☁️ Deploy

Feito na [Vercel](https://vercel.com). Configure as variáveis de ambiente acima no painel do projeto.
