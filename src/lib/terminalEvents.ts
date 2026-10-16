/** Nome do evento que pede ao `Terminal` para executar um comando. */
export const TERMINAL_RUN_EVENT = "terminal:run";

/**
 * Executa um comando no terminal como se o usuário tivesse digitado —
 * para saídas de comandos interativas (ex.: clicar numa tecnologia em
 * `habilidades`). Ignorado enquanto o terminal está no fluxo de contato.
 */
export function runTerminalCommand(command: string) {
    window.dispatchEvent(new CustomEvent<string>(TERMINAL_RUN_EVENT, { detail: command }));
}
