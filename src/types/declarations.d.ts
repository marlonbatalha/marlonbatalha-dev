/**
 * Permite `import "./arquivo.css"` (ex.: `globals.css` no `layout.tsx`)
 * sem erro do TypeScript. O CSS é processado pelo Next/Tailwind; aqui só
 * avisamos ao compilador que esse tipo de import existe.
 */
declare module "*.css";
