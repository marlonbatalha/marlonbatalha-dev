# Refatoração — Portfólio Terminal

> Documento de planejamento e especificação técnica para a refatoração do portfólio em formato de terminal interativo. Cobre diagnóstico do estado atual, problemas identificados, melhorias de UI/UX e mudanças estruturais nos componentes.

---

## 1. Diagnóstico do estado atual

### 1.1 Estrutura de arquivos envolvidos

- `Terminal.tsx` — componente principal, gerencia histórico, input e despacho de comandos
- `commands/About.tsx` — output do comando `about`
- `commands/Projects.tsx` — output do comando `projects`
- `commands/Skills.tsx` — output do comando `skills`
- `commands/Contact.tsx` — output do comando `contact`
- `hooks/useContatoForm.ts` — lógica do formulário de contato
- `data/projects.ts` — fonte de dados dos projetos
- `layout/Header.tsx` e `Footer.tsx` — layout global

### 1.2 Problemas de UX identificados

**Falta de comportamento de terminal real**

- Não há navegação por histórico de comandos com as teclas ↑ e ↓
- Não existe tab completion para os comandos disponíveis
- Não há atalho `Ctrl+L` para limpar o terminal
- O comando `clear` usa uma mutação direta de estado que pode causar race condition com entradas seguintes
- O input não tem nenhuma dica visual de que é interativo

**Ausência de orientação ao usuário**

- Nenhuma indicação de quais comandos existem na tela inicial
- A mensagem de boas-vindas é genérica e não tem identidade visual
- Não há distinção visual entre o prompt, o comando digitado e o output
- Erros de comando não encontrado aparecem identicamente ao output normal

**Formulário de contato deslocado**

- Um formulário HTML dentro de um terminal quebra a metáfora do produto
- O usuário precisa de contexto diferente para interagir com ele
- O formulário depende de `useContatoForm` mas o hook não está implementado nos arquivos fornecidos

### 1.3 Problemas de UI identificados

**Tipografia**

- A fonte monospace atual não está declarada explicitamente — herda do sistema ou do Tailwind, sem garantia de consistência entre ambientes
- Não existe hierarquia tipográfica entre prompt, comando, output de sucesso, output de erro e texto de metadado

**Cores**

- Tudo usa `text-green-500` de forma uniforme, sem semântica de cor
- O `text-white` usado no prompt não tem contraste claro com o `text-green-400` do output
- Não existe diferenciação visual para: erros, informações, sucessos, texto secundário

**Animações**

- Framer Motion está sendo importado em cada componente filho individualmente
- As animações de entrada (`opacity: 0 → 1`, `y: 10 → 0`) são aplicadas com `duration: 0.3`, que é uma duração razoável mas não dá sensação de terminal imprimindo texto
- O uso de `staggerChildren` nos filhos cria um delay que torna a interface mais lenta do que um terminal real pareceria

**Identidade visual**

- Não existe elemento de identidade logo no primeiro render — nenhum ASCII art, banner ou apresentação visual marcante
- A barra de título do terminal não tem os controles visuais (botões coloridos estilo macOS) que ancoram a metáfora
- Não há statusbar com informações contextuais do terminal

### 1.4 Problemas de código identificados

**Lógica do `runCommand`**

- A função `appendHistory` é chamada duas vezes na sequência — uma para o prompt e outra para o output — o que pode causar re-renders desnecessários
- O handler `clear` está misturado no mesmo `registry` dos outros comandos mas tem efeito colateral direto no estado (`setHistory([])`), quebrando a separação entre dados e efeitos
- Não existe tratamento para comandos com argumentos (ex: `open projects`, `rm -rf`)

**Tipos**

- `HistoryEntry.out` aceita `React.ReactNode | null`, mas null é filtrado com `.filter(Boolean)` que pode ter comportamento inesperado com `0` ou strings vazias
- O `registry` é recriado a cada render pois está dentro do componente sem `useMemo` ou extração para fora

**Acessibilidade**

- O `role="application"` no container é correto, mas falta `aria-live="polite"` na região de output para screen readers
- O campo de input não tem `aria-label` descritivo
- Os links dentro de `Projects.tsx` abrem em `_blank` sem `rel="noopener noreferrer"` em todos os casos

---

## 2. Mudanças de UI

### 2.1 Tipografia

Substituir a fonte monospace padrão por **JetBrains Mono** (Google Fonts), que tem personalidade de terminal de desenvolvimento e é gratuita. Importar via `globals.css` ou via `next/font/google`.

Definir a fonte em `body` dentro do layout e garantir que todos os elementos do terminal herdem via `font-mono` do Tailwind ou via classe CSS customizada.

### 2.2 Paleta semântica

Definir classes utilitárias ou variáveis CSS para cada tipo de output, em vez de usar `text-green-400` em tudo:

| Tipo de conteúdo     | Cor sugerida                | Uso                            |
| -------------------- | --------------------------- | ------------------------------ |
| Prompt — usuário     | `#00ff88` (verde brilhante) | Parte `marlon` do prompt       |
| Prompt — host        | `#00cfff` (ciano)           | Parte `portfolio` do prompt    |
| Prompt — path        | `#a78bfa` (roxo claro)      | Parte `~` do prompt            |
| Comando digitado     | `#e8e8e8` (branco suave)    | Texto após o `$`               |
| Output de informação | `#00cfff`                   | Cabeçalhos de seção            |
| Output de sucesso    | `#00ff88`                   | Confirmações                   |
| Output de erro       | `#ff5f57`                   | Comando não encontrado, falhas |
| Output de aviso      | `#f59e0b`                   | Avisos opcionais               |
| Texto secundário     | `#666`                      | Descrições, metadados          |
| ASCII art            | `#00ff88`                   | Banner de boas-vindas          |

### 2.3 Estrutura visual do componente Terminal

O componente deve ser dividido em quatro regiões visuais:

**Titlebar** (topo fixo)
Barra escura com três círculos coloridos estilo macOS (vermelho, amarelo, verde) e o título `marlon@portfolio — bash` centralizado. Purely decorativo, sem funcionalidade.

**Statusbar** (abaixo da titlebar)
Linha fina com informações de contexto: indicador de conexão (ponto pulsando verde), versão do shell, encoding e horário atual. O horário pode ser atualizado via `setInterval`. Reforça a metáfora de terminal real.

**Corpo do terminal** (área de scroll)
Região com `overflow-y: auto` onde o histórico é exibido. Cada entrada deve ter espaçamento vertical sutil. Ao receber nova entrada, deve rolar automaticamente para o final (`scrollTop = scrollHeight`).

**Input row** (fixo no rodapé)
Linha com o prompt completo (`marlon@portfolio:~$`) seguido do campo de input. O prompt deve ter as mesmas cores semânticas usadas nos outputs de comando.

**Hint bar** (abaixo do input)
Linha muito discreta mostrando os atalhos disponíveis: ↑↓ histórico, Tab completar, Ctrl+L limpar, Enter executar. Usa texto muito apagado para não distrair.

### 2.4 Tela de boas-vindas

Substituir a mensagem genérica por um bloco de welcome estruturado:

- ASCII art com o nome "MARLON" em fonte grande (usando caracteres de bloco Unicode)
- Linha separadora decorativa
- Subtítulo com cargo e localização
- Linha de instrução: `Digite "help" para ver os comandos disponíveis.`

Esse bloco deve ser injetado no histórico como primeiro item no `useState`, não como JSX estático separado.

### 2.5 Efeito visual opcional

Adicionar um overlay de scanlines CRT sutis sobre o terminal inteiro usando `::before` com `repeating-linear-gradient`. A opacidade deve ser muito baixa (≤ 8%) para que não prejudique a leitura. O cursor piscante no input deve usar `caret-color: #00ff88`.

### 2.6 Animações

Remover as animações Framer Motion dos componentes filhos. Substituir por animação CSS simples de `fade-in` via `@keyframes` aplicada a cada nova linha do output. Isso:

- Remove a dependência de Framer Motion nos componentes de comando
- Dá sensação de terminal imprimindo texto em vez de UI animada
- Reduz o bundle size

Manter Framer Motion apenas se houver outros usos no projeto que justifiquem a dependência.

---

## 3. Mudanças de UX

### 3.1 Histórico de comandos

Adicionar um estado separado `cmdHistory: string[]` e um índice `historyIndex: number` (iniciando em `-1`).

Comportamento esperado:

- Ao executar um comando, empurrar o texto para o início do array de histórico e resetar o índice para `-1`
- Ao pressionar ↑, incrementar o índice e preencher o input com o comando correspondente
- Ao pressionar ↓, decrementar o índice; se chegar a `-1`, limpar o input
- Não navegar além dos limites do array em nenhuma direção

### 3.2 Tab completion

Ao pressionar Tab com texto parcial no input:

- Buscar nos nomes de comando registrados quais começam com o texto atual
- Se houver exatamente um match, completar o input automaticamente
- Se houver múltiplos matches, exibir todos como uma linha de output e manter o texto atual no input
- Se não houver nenhum match, não fazer nada (sem beep ou feedback negativo)

### 3.3 Atalho Ctrl+L

Capturar `e.ctrlKey && e.key === 'l'` no handler de keydown do input. Ao detectar, limpar o histórico de output (equivalente ao comando `clear`) sem registrar o atalho como entrada no histórico de comandos.

### 3.4 Foco automático e recuperação de foco

- Focar o input automaticamente no mount (já implementado)
- Adicionar um listener de click no container do terminal para retornar o foco ao input caso o usuário clique em qualquer área do terminal que não seja um link

### 3.5 Reformulação do comando `contact`

Remover o formulário HTML do output do comando `contact`. Em vez disso, exibir as informações de contato como linhas de texto simples (estilo `key → value`) com os canais disponíveis: e-mail, GitHub, LinkedIn. Isso mantém a coerência com a metáfora de terminal.

Se o envio de mensagem for desejado, pode ser implementado como um sub-fluxo de comandos (ex: o terminal pede nome, depois e-mail, depois mensagem, em passos sequenciais), mas isso é escopo futuro.

### 3.6 Comando `whoami`

Adicionar comando `whoami` que retorna uma linha única de identificação: nome, cargo e localização. Útil para quem testa comandos rápidos de terminal por hábito.

### 3.7 Comando `ls`

Adicionar comando `ls` que lista as seções disponíveis como se fossem diretórios: `about/  projects/  skills/  contact/`. Reforça a metáfora de sistema de arquivos.

---

## 4. Mudanças estruturais no código

### 4.1 Separação do registro de comandos

Mover o `registry` de dentro do componente para um arquivo separado, por exemplo `commands/registry.tsx`. Cada comando exporta sua função de output. O arquivo de registro mapeia nome → função. Isso:

- Elimina a recriação do objeto a cada render
- Torna trivial adicionar novos comandos sem tocar no `Terminal.tsx`
- Permite importar o array de nomes de comando para o tab completion sem dependência circular

### 4.2 Tipos mais precisos

Substituir `React.ReactNode | null` em `HistoryEntry.out` por um tipo de output estruturado. Cada output é um array de "linhas" com tipo e conteúdo, em vez de JSX arbitrário. Isso facilita:

- Renderizar outputs de forma consistente
- Aplicar estilos semânticos por tipo de linha
- Testar outputs sem renderização

Exemplo de estrutura:

```
type OutputLine =
  | { type: 'text' | 'info' | 'success' | 'error' | 'muted'; text: string }
  | { type: 'project'; ... }
  | { type: 'skills' }
  | { type: 'ascii'; text: string }
```

### 4.3 Handler `clear` isolado

O comando `clear` não deve estar no mesmo `registry` dos outros comandos, pois tem efeito colateral direto no estado do componente. Tratar como caso especial no `runCommand`, antes de despachar para o registry.

### 4.4 Scroll automático confiável

Após cada append no histórico, rolar o container para o final. Usar `useEffect` com dependência no array de histórico e `ref` no container, chamando `el.scrollTop = el.scrollHeight`. Não depender de `requestAnimationFrame` ou `setTimeout` para isso.

### 4.5 Remoção do `dynamic` para comandos simples

`About`, `Skills` e `Projects` são componentes leves que não justificam lazy loading com `next/dynamic`. O lazy load adiciona um flash de carregamento visível que quebra a fluidez do terminal. Importar diretamente. Manter `dynamic` apenas para `Contact` se o formulário for mantido e for pesado.

### 4.6 Acessibilidade

- Adicionar `aria-live="polite"` no container do histórico de output
- Adicionar `aria-label="Entrada de comando"` no input
- Garantir que todos os links em `Projects` tenham `rel="noopener noreferrer"` quando `target="_blank"`
- Garantir que o contraste mínimo de 4.5:1 seja respeitado para todos os textos sobre o fundo escuro

---

## 5. Ordem de execução recomendada

As mudanças devem ser feitas na seguinte ordem para minimizar conflitos e permitir teste incremental:

1. **Tipografia e paleta** — alterar `globals.css` e as classes do `Terminal.tsx` sem mudar lógica
2. **Estrutura visual** — adicionar titlebar, statusbar e hint bar como markup estático
3. **Separação do registry** — mover os comandos para arquivo próprio e ajustar os tipos
4. **Handler de teclado** — adicionar histórico (↑/↓), tab completion e Ctrl+L
5. **Tela de welcome** — substituir a mensagem inicial pelo bloco ASCII + instruções
6. **Substituição do contato** — remover o formulário e implementar output de texto simples
7. **Novos comandos** — adicionar `whoami` e `ls`
8. **Animações** — remover Framer Motion dos filhos e adicionar keyframe CSS de fade-in
9. **Acessibilidade** — revisar aria attributes e contraste

---

## 6. O que não mudar

- A arquitetura de componentes filhos por comando pode ser mantida — apenas os tipos de saída precisam ser ajustados
- O hook `useContatoForm` pode ser mantido se o formulário for reintroduzido como fluxo de comandos no futuro
- O arquivo `data/projects.ts` não precisa de alterações estruturais
- O `RootLayout` com `bg-black font-mono` como base está correto e não precisa mudar
