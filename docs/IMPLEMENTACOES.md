Animações do Portfólio Terminal
Typewriter Effect & Glitch Effect — Arquitetura e Implementação

---

1. Typewriter Effect
   Objetivo
   Simular digitação humana ao exibir a resposta de cada comando executado no terminal. O texto aparece caractere por caractere com velocidade variável, criando a ilusão de que o sistema está "respondendo em tempo real".

---

Arquitetura

```
src/
├── hooks/
│   └── useTypewriter.ts          # Hook reutilizável com toda a lógica
├── components/
│   └── terminal/
│       ├── TerminalOutput.tsx    # Renderiza o output com o efeito
│       └── TerminalLine.tsx      # Linha individual animada
└── types/
    └── terminal.ts               # Tipos compartilhados
```

---

Tecnologias e Dependências
React 18+ — hooks nativos (`useState`, `useEffect`, `useCallback`, `useRef`)
TypeScript — tipagem de todos os estados e props
Tailwind CSS — cursor piscando via classe `animate-pulse` ou `animate-blink`
Sem biblioteca externa — implementação 100% nativa

---

Lógica de Funcionamento
Fluxo geral
O usuário digita um comando e pressiona Enter
O terminal identifica o comando e busca o conteúdo de resposta (pode ser string, array de strings ou array de linhas com delays individuais)
O hook `useTypewriter` recebe esse conteúdo e inicia o ciclo de animação
Caractere por caractere é adicionado ao estado, provocando re-render incremental
Ao terminar uma linha, o hook aguarda um delay de "pausa entre linhas" antes de iniciar a próxima
Ao terminar todo o conteúdo, o estado `isComplete` é setado como `true` e o cursor para de piscar (ou desaparece)
Velocidades recomendadas
Velocidade base por caractere: 25ms a 40ms
Variação aleatória: ±15ms (para simular digitação humana imperfeita)
Pausa entre linhas: 180ms a 250ms
Pausa após pontuação (`.` `,` `:`): +80ms a +120ms extra
Pausa inicial antes de começar: 150ms (simula "processamento" do comando)
Comportamento do cursor
Cursor fica visível e piscando enquanto o typewriter está ativo
Quando `isComplete === true`, o cursor continua piscando mas muda de cor (de verde brilhante para verde mais apagado)
O cursor é um `<span>` inline com animação CSS de opacidade: `0% → 100% → 0%` em ciclos de 1s

---

Estados do Hook `useTypewriter`
Estado Tipo Descrição
`displayedText` `string[]` Array de linhas já renderizadas (cada posição = uma linha)
`currentLineIndex` `number` Qual linha está sendo digitada agora
`currentCharIndex` `number` Qual caractere da linha atual está sendo inserido
`isTyping` `boolean` Se a animação está em andamento
`isComplete` `boolean` Se todo o conteúdo foi renderizado
`isPaused` `boolean` Pausado entre linhas

---

Props do Hook
Prop Tipo Padrão Descrição
`lines` `string[]` obrigatório Array de linhas a serem digitadas
`baseSpeed` `number` `30` Velocidade base em ms por caractere
`humanVariance` `number` `15` Variação aleatória em ms
`lineDelay` `number` `200` Pausa entre linhas em ms
`startDelay` `number` `150` Delay inicial antes de começar
`onComplete` `() => void` `undefined` Callback ao terminar
`punctuationDelay` `number` `100` Delay extra após `.` `,` `:`

---

Estrutura do Conteúdo dos Comandos
Cada comando registrado no terminal deve ter sua resposta definida como array de strings (linhas). Exemplo de estrutura de dados:

```
commands: {
  "sobre": {
    lines: [
      "Olá! Sou desenvolvedor Full Stack...",
      "Trabalho com Next.js, .NET C#, NestJS e Azure.",
      "Baseado no Rio de Janeiro, Brasil.",
      "",
      "Digite 'projetos' para ver meu trabalho."
    ],
    speedOverride: 25    // opcional — comandos de texto longo podem ser mais rápidos
  },
  "whoami": {
    lines: ["Marlon Batalha — Full Stack Developer"],
    speedOverride: 40
  }
}
```

---

Interação com o Terminal
O hook deve ser instanciado por execução de comando, não globalmente. Cada vez que um comando é executado, uma nova instância do efeito é iniciada para aquele output específico.
Outputs anteriores (histórico do terminal) devem ser renderizados completos e imediatos, sem animação — apenas o output mais recente anima.
O scroll do terminal deve acompanhar automaticamente o texto sendo digitado (`scrollIntoView` no elemento do cursor).
O input do terminal deve ser bloqueado (disabled) enquanto `isTyping === true`, liberando apenas quando `isComplete === true`.

---

Acessibilidade
Usar `aria-live="polite"` no container do output para leitores de tela receberem o conteúdo completo ao final
Manter o texto completo em um `<span>` com `sr-only` desde o início, enquanto a versão animada é `aria-hidden="true"`
Respeitar `prefers-reduced-motion`: se ativo, renderizar o texto completo instantaneamente sem animação

---

2. Glitch Effect
   Objetivo
   Aplicar um efeito de distorção visual RGB split no título principal "MARLON BATALHA" — como se o sinal do monitor estivesse falhando. O efeito dispara automaticamente em intervalos, é puramente visual e não interfere na legibilidade.

---

Arquitetura

```
src/
├── components/
│   └── terminal/
│       ├── GlitchText.tsx        # Componente do título com glitch
│       └── GlitchText.module.css # Animações CSS (ou via Tailwind config)
└── hooks/
    └── useGlitch.ts              # Hook opcional para controle programático
```

---

Tecnologias e Dependências
CSS Animations — `@keyframes` com `clip-path` para o split RGB
CSS Custom Properties — para controlar intensidade e cores do glitch
React — componente simples, sem estado complexo
Tailwind CSS — para classes base; as animações de glitch vão em CSS puro (`globals.css` ou CSS Module) pois Tailwind não cobre keyframes personalizados desse tipo
Sem biblioteca externa

---

Lógica de Funcionamento
Técnica: Pseudo-elementos com `clip-path`
O texto principal existe uma vez no DOM. Dois pseudo-elementos (`::before` e `::after`) são criados com o mesmo conteúdo via `content: attr(data-text)` — cada um recebe uma cor diferente (ciano e vermelho) e um `clip-path` que expõe apenas uma faixa horizontal do texto.
Os dois pseudo-elementos se movem horizontalmente em direções opostas e em momentos ligeiramente diferentes, criando o efeito de "desalinhamento de sinal" característico do glitch.
Faixas de clip-path
Pseudo-elemento 1 (vermelho): expõe uma faixa entre 15% e 35% da altura do elemento
Pseudo-elemento 2 (ciano): expõe uma faixa entre 60% e 80% da altura do elemento
As faixas não se sobrepõem para que o texto base permaneça legível no centro
Timing da animação
Duração total do ciclo: 3s a 4s
Janela de glitch ativa: apenas 10% do ciclo (0.3s a 0.4s) — o restante o texto fica estático
Intensidade do deslocamento horizontal: ±2px a ±5px (valores maiores ficam agressivos demais)
Os dois pseudo-elementos têm keyframes com timings diferentes entre si para parecer mais caótico e menos mecânico
Variação adicional: micro-glitches
Além do glitch principal, um segundo `@keyframes` mais sutil pode ser aplicado ao elemento inteiro — um `translateX` de ±1px que dura apenas 50ms e dispara em momentos aleatórios dentro do ciclo. Isso simula ruído de sinal.

---

Variantes de Intensidade
Variante Uso recomendado Deslocamento Frequência
`subtle` Hover ou idle constante ±1–2px Ciclos de 4s
`normal` Load inicial da página ±3–4px Ciclos de 3s
`intense` Easter egg / comando especial ±6–8px Ciclos de 1.5s
A variante é controlada por uma prop `intensity: "subtle" | "normal" | "intense"` que altera um `data-intensity` attribute no elemento, mapeado para diferentes CSS custom properties.

---

Props do Componente `GlitchText`
Prop Tipo Padrão Descrição
`text` `string` obrigatório Texto a ser exibido
`intensity` `"subtle" | "normal" | "intense"` `"normal"` Intensidade do efeito
`as` `keyof JSX.IntrinsicElements` `"h1"` Tag HTML do elemento
`className` `string` `""` Classes adicionais
`triggerOnHover` `boolean` `false` Glitch apenas no hover
`autoPlay` `boolean` `true` Glitch automático em loop

---

Integração com o Load da Página
O fluxo de animação no carregamento ideal é:
Página carrega → terminal container aparece (fade in simples, 300ms)
ASCII art / título renderiza já com glitch ativo na intensidade `normal`
Após 2s, a intensidade cai para `subtle` e continua em loop eterno
Se o usuário passa o mouse sobre o título, um glitch `intense` é disparado por 500ms
Isso cria uma primeira impressão forte e depois mantém vida no elemento sem distrair.

---

Acessibilidade
O atributo `data-text` no elemento deve conter o mesmo valor que o `textContent` — nunca diferirem
Adicionar `aria-label` com o texto no elemento para garantir que leitores de tela leiam "MARLON BATALHA" e não dois textos duplicados via pseudo-elementos
Com `prefers-reduced-motion` ativo, os pseudo-elementos recebem `animation: none` e o efeito é completamente desativado — o texto continua visível normalmente

---

3. Sugestões Adicionais de Animações e Interações

---

3.1 Tab Completion (como o bash real)
O que é: pressionar `Tab` com texto parcial no input autocompleta para o comando mais próximo. Se houver múltiplas opções, elas aparecem listadas abaixo do input como sugestões.
Comportamento:
`pro` + Tab → `projetos`
`ha` + Tab → lista: `habilidades`, `hard-skills`
Som sutil de "tick" (opcional, com Web Audio API)
Tecnologia: lógica de string matching nos comandos registrados, filtrado em tempo real. Sem biblioteca.

---

3.2 Histórico de Comandos com Setas (↑ ↓)
O que é: pressionar a seta para cima no input navega pelo histórico de comandos já executados naquela sessão, exatamente como o bash.
Comportamento:
`↑` → preenche o input com o comando anterior
`↓` → avança no histórico (ou limpa o input se estiver no fim)
O índice do histórico é resetado a cada novo comando executado
Tecnologia: `useState` com array de histórico e índice de navegação. `onKeyDown` no input captura `ArrowUp` e `ArrowDown`.

---

3.3 Easter Egg — Comando Secreto
O que é: um comando não listado no `ajuda` que dispara uma animação especial. Pode ser o nome de uma tecnologia, uma frase, ou uma referência cultural.
Sugestões de trigger:
`sudo rm -rf /` → tela pisca em vermelho com mensagem de "acesso negado" e glitch intenso
`hack` → Matrix rain em tela cheia por 3 segundos
`coffee` → ASCII art de uma xícara de café com vapor animado
`neofetch` → exibe "specs" da máquina com informações reais do desenvolvedor no estilo neofetch
Tecnologia: simplesmente um `case` extra no switch de comandos que renderiza um componente especial com animação dedicada.

---

3.4 Cursor Temático no Input
O que é: o cursor de texto dentro do input do terminal é substituído por um bloco verde (`█`) piscando, como terminais reais — em vez do cursor de texto padrão do browser.
Comportamento:
Input com `caret-color: transparent` (esconde o cursor nativo)
Um `<span>` posicionado absolutamente no mesmo local que o cursor real, animando opacidade
A posição do span é calculada baseada no `selectionStart` do input e largura do texto
Tecnologia: `caretColor: 'transparent'` via Tailwind + posicionamento com `getBoundingClientRect` e canvas para medir largura de texto monospace.

---

3.5 Sound Design (Opcional)
O que é: sons minimalistas sincronizados com as interações do terminal.
Efeitos sugeridos:
Tecla pressionada → tick suave (como teclado mecânico, volume muito baixo)
Comando executado → bip curto estilo terminal anos 80
Erro de comando → bip grave descendente
Comando especial desbloqueado → jingle de 2 segundos
Tecnologia: `Web Audio API` pura — osciladores e `GainNode`. Sem arquivos de áudio externos. Um `AudioContext` singleton é criado no primeiro clique do usuário (política de autoplay dos browsers) e reutilizado durante toda a sessão. Botão mute/unmute no canto do terminal.

---

3.6 Modo `--verbose`
O que é: um flag que o usuário pode adicionar a qualquer comando para receber mais detalhes. Muda o comportamento do typewriter para incluir linhas extras de "output técnico".
Exemplo:

```
$ sobre --verbose
[INFO] Carregando perfil do desenvolvedor...
[DATA] Nome: Marlon Batalha
[DATA] Localização: Rio de Janeiro, Brasil
[DATA] Stack primária: Next.js · .NET C# · NestJS · Azure
[DATA] Anos de experiência: 5+
[DONE] Perfil carregado com sucesso.
```

## Tecnologia: parsing dos argumentos do comando (`split(' ')`) e verificação de flag `--verbose` antes de escolher qual array de linhas entregar ao typewriter.

Priorização Sugerida

# Animação / Interação Impacto Visual Custo de Implementação

1 Typewriter Effect Alto Médio
2 Glitch Effect Alto Baixo
3 Tab Completion Alto Baixo
4 Histórico com setas ↑↓ Médio Baixo
5 Cursor temático `█` Médio Médio
6 Easter Egg (`sudo`, `hack`) Alto Baixo
7 Modo `--verbose` Médio Baixo
8 Sound Design Médio Médio
